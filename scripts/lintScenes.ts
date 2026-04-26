import * as fs from 'fs';
import * as path from 'path';

/**
 * 最小剧情安全检查工具 (MVP)
 * 检查项：
 * 1. nextSceneId 是否存在
 * 2. Flag 命名一致性警告
 * 3. Orphan Scene 警告
 */

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

interface SceneRef {
  id: string;
  file: string;
}

interface Reference {
  targetId: string;
  sourceFile: string;
  line: number;
}

interface FlagRef {
  name: string;
  file: string;
  line: number;
}

const allScenes: Map<string, SceneRef> = new Map();
const allReferences: Reference[] = [];
const allFlags: FlagRef[] = [];

function walk(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // 1. 查找 Scene ID 定义
    // 匹配 id: '...' 或 id: "..."
    const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
    if (idMatch) {
      allScenes.set(idMatch[1], { id: idMatch[1], file: filePath });
    }

    // 2. 查找 nextSceneId 引用
    const nextMatch = line.match(/nextSceneId:\s*['"]([^'"]+)['"]/);
    if (nextMatch) {
      allReferences.push({ targetId: nextMatch[1], sourceFile: filePath, line: lineNum });
    }

    // 3. 查找 Flag 引用 (condition 或 actions 中)
    // 匹配 flag: '...' 或 flag: "..."
    const flagMatches = line.matchAll(/flag:\s*['"]([^'"]+)['"]/g);
    for (const match of flagMatches) {
      allFlags.push({ name: match[1], file: filePath, line: lineNum });
    }
  });
}

function runLint() {
  console.log('--- Narrative Safety Linter (MVP) ---');
  walk(DATA_DIR);

  let errorCount = 0;
  let warnCount = 0;

  // 1. 检查 nextSceneId 是否存在
  allReferences.forEach(ref => {
    if (!allScenes.has(ref.targetId)) {
      console.error(`[ERROR] Missing Scene:`);
      console.error(`  - SceneId: ${ref.targetId}`);
      console.error(`  - Referenced in: ${path.relative(process.cwd(), ref.sourceFile)}:${ref.line}`);
      errorCount++;
    }
  });

  // 2. 检查 Flag 拼写一致性 (Exact match warning)
  const flagNames = Array.from(new Set(allFlags.map(f => f.name)));
  const normalizedMap: Map<string, string[]> = new Map();

  flagNames.forEach(name => {
    // 简单归一化：小写并去除下划线
    const normalized = name.toLowerCase().replace(/_/g, '').replace(/-/g, '');
    if (!normalizedMap.has(normalized)) {
      normalizedMap.set(normalized, []);
    }
    normalizedMap.get(normalized)!.push(name);
  });

  normalizedMap.forEach((variations, normalized) => {
    if (variations.length > 1) {
      console.warn(`[WARN] Inconsistent Flag Naming Variations for "${normalized}":`);
      variations.forEach(v => {
        const firstOccur = allFlags.find(f => f.name === v);
        console.warn(`  - "${v}" (e.g., at ${path.relative(process.cwd(), firstOccur!.file)}:${firstOccur!.line})`);
      });
      warnCount++;
    }
  });

  // 3. Orphan Scene 检查
  const referencedSceneIds = new Set(allReferences.map(r => r.targetId));
  // 排除 'start' 作为起点
  allScenes.forEach((scene, id) => {
    if (id !== 'start' && !referencedSceneIds.has(id)) {
      console.warn(`[WARN] Orphan Scene:`);
      console.warn(`  - SceneId: ${id}`);
      console.warn(`  - Defined in: ${path.relative(process.cwd(), scene.file)}`);
      warnCount++;
    }
  });

  console.log('\n--- Summary ---');
  console.log(`Errors: ${errorCount}`);
  console.log(`Warnings: ${warnCount}`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

runLint();
