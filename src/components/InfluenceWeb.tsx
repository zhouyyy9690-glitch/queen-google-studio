import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Character } from '../types';
import { EmbossedInitial } from './EmbossedInitial';

interface InfluenceWebProps {
  unlockedCharacters: Set<string>;
  characters: Character[];
  setSelectedCharacterId: (id: string) => void;
  selectedCharacterId?: string;
  history: string[];
}

/**
 * InfluenceWeb - 命运之网 / 王统血缘图
 * 展现人物之间的错综复杂的关系连线，视觉风格参考古航海图。
 */
export const InfluenceWeb: React.FC<InfluenceWebProps> = ({
  unlockedCharacters,
  characters,
  setSelectedCharacterId,
  selectedCharacterId,
  history
}) => {
  // 提取所有已解锁的角色，并过滤掉没有位置提示的角色（可选，或者给默认位置）
  const nodes = useMemo(() => {
    return characters.filter(c => unlockedCharacters.has(c.id));
  }, [characters, unlockedCharacters]);

  // 构建所有的关系连线
  const links = useMemo(() => {
    const result: { from: Character; to: Character; type: string; label: string }[] = [];
    nodes.forEach(node => {
      if (node.relations) {
        node.relations.forEach(rel => {
          const target = nodes.find(n => n.id === rel.to);
          if (target) {
            // 避免重复定义双向线（简单处理：id 排序）
            // if (node.id < target.id) {
              result.push({ from: node, to: target, type: rel.type, label: rel.label });
            // }
          }
        });
      }
    });
    return result;
  }, [nodes]);

  // 生成四角星路径
  const getStarPath = (cx: number, cy: number, rOuter: number, rInner: number) => {
    const points = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45 - 90) * Math.PI / 180;
      const r = (i % 2 === 0) ? rOuter : rInner;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')} Z`;
  };

  const [viewBox, setViewBox] = React.useState({ x: 0, y: 0, w: 1000, h: 1000 });

  return (
    <div 
      className="relative w-full h-full bg-[#030305] overflow-hidden"
      onClick={() => setSelectedCharacterId('')} // 点击背景取消选中
    >
      {/* 航海图背景装饰：星相、网格、旧纸张 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] mix-blend-overlay opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
        
        {/* 指南针/星盘样式网格 */}
        <svg className="w-full h-full opacity-30">
          <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#4A3B30" strokeWidth="0.5" strokeDasharray="5,10" />
          <circle cx="50%" cy="50%" r="25%" fill="none" stroke="#4A3B30" strokeWidth="0.5" strokeDasharray="2,5" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#4A3B30" strokeWidth="0.2" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#4A3B30" strokeWidth="0.2" />
          
          {/* 装饰性背景小星点 */}
          {[...Array(20)].map((_, i) => (
            <motion.circle
              key={`bg-star-${i}`}
              cx={`${10 + (i * 7) % 80}%`}
              cy={`${10 + (i * 13) % 80}%`}
              r="0.5"
              fill="#D4AF37"
              initial={{ opacity: 0.1 }}
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </svg>
      </div>

      <motion.div 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        drag
        dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
        dragElastic={0.1}
        dragMomentum={true}
      >
        <svg 
          viewBox="0 0 1000 1000" 
          className="w-full h-full overflow-visible"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 绘制关系线 (星座连线风格) */}
          {links.map((link, i) => {
            const posStart = link.from.positionHint || { x: 50, y: 50 };
            const posEnd = link.to.positionHint || { x: 50, y: 50 };
            
            const isEnemy = link.type === 'enemy';
            const isKin = link.type === 'kin' || link.type === 'spouse';
            const strokeColor = isEnemy ? "#8b0000" : "#D4AF37";
            const opacity = isEnemy ? 0.3 : 0.2;
            const strokeWidth = isKin ? 3 : 1.5; // 在 1000px 坐标系下稍微加粗
            const strokeDash = isEnemy ? "4,4" : "15,8";

            return (
              <motion.line
                key={`link-${i}`}
                x1={posStart.x * 10}
                y1={posStart.y * 10}
                x2={posEnd.x * 10}
                y2={posEnd.y * 10}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDash}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: opacity }}
                transition={{ duration: 1.5, delay: i * 0.05 }}
              />
            );
          })}

          {/* 绘制人物节点 (星星节点) */}
          {nodes.map(node => {
            const pos = node.positionHint || { x: 50, y: 50 };
            const isSelected = selectedCharacterId === node.id;
            const isMain = node.id === 'catherine'; 

            return (
              <motion.g
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.2 }}
                onPointerDown={(e) => e.stopPropagation()} // 防止触发拖拽开始
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCharacterId(node.id);
                }}
                className="cursor-pointer"
              >
                {/* 背景辉光 */}
                <circle
                  cx={pos.x * 10}
                  cy={pos.y * 10}
                  r={isSelected ? 60 : 35}
                  fill="url(#nodeGlow)"
                  className="pointer-events-none"
                />

                {/* 星星形状 */}
                <g transform={`translate(${pos.x * 10}, ${pos.y * 10})`}>
                  <motion.path
                    d={getStarPath(0, 0, isMain ? 25 : 18, isMain ? 10 : 7)}
                    fill={isSelected ? "#D4AF37" : "#8b5e34"}
                    stroke="#D4AF37"
                    strokeWidth="1"
                    animate={isSelected ? {
                      filter: "drop-shadow(0 0 10px #D4AF37)",
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </g>

                {/* 姓名标签 */}
                <text
                  x={pos.x * 10}
                  y={pos.y * 10 + 45}
                  textAnchor="middle"
                  className={`fill-amber-100/80 text-[18px] font-display tracking-[0.2em] uppercase pointer-events-none transition-all duration-300 ${isSelected ? 'fill-amber-500 font-bold' : ''}`}
                  style={{ filter: isSelected ? 'drop-shadow(0 0 4px black)' : 'none' }}
                >
                  {node.name}
                </text>
                
                {/* 英文标识 */}
                {isSelected && (
                  <text
                    x={pos.x * 10}
                    y={pos.y * 10 - 35}
                    textAnchor="middle"
                    className="fill-amber-900/50 text-[10px] uppercase tracking-widest font-serif pointer-events-none shadow-sm"
                  >
                    {node.nameEn}
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>
      </motion.div>
      
      {/* 操作提示 */}
      <div className="absolute bottom-6 left-6 text-[8px] tracking-widest text-amber-900/30 uppercase font-display pointer-events-none">
        Navigate through the Web of Fate · 点击节点查看秘辛
      </div>
    </div>
  );
};
