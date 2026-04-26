# 狐狸线 (Fox Path) 剧情逻辑汇总

本文档旨在记录狐狸线（第一阶段：绿野王女 & 第二阶段：新的女王）中的关键分支点、Flag 变量及其对后续剧情的影响。

---

## 序章：绿野王女 (Chapter 0)

### 核心变量与 Flag
| Flag 变量 | 含义 | 设置位置 | 影响 |
| :--- | :--- | :--- | :--- |
| `toldFain` | 是否向芬恩坦白真相 | `act1-p2-day.ts` | 影响逃亡时的对话及后续重逢时的心境。 |
| `talkedToNun` | 是否拜访梅莉桑德修女 | `act1-p4-night.ts` | 决定夜谈的完成度。 |
| `nunDeepTalk` | 修女夜谈是否进入深层 | `act1-p4-night.ts` | 逃亡成功条件的判据之一。 |
| `talkedToKnight` | 是否拜访罗德里克爵士 | `act1-p4-night.ts` | 决定夜谈的完成度。 |
| `knightDeepTalk` | 爵士夜谈是否进入深层 | `act1-p4-night.ts` | 逃亡成功条件的判据之一。 |
| `talkedToScholar` | 是否拜访昆提斯 | `act1-p4-night.ts` | 决定夜谈的完成度。 |
| `scholarDeepTalk` | 学者夜谈是否进入深层 | `act1-p4-night.ts` | 逃亡成功条件的判据之一。 |

### 关键分歧点
1.  **坦白与否 (`act1-p2-day.ts`)**
    *   坦白真相 -> `toldFain: true`
    *   编造谎言 -> `toldFain: false`
2.  **逃亡前的准备 (`act1-p4-night.ts`)**
    *   **循环机制**：玩家必须在三个角色（修女、爵士、学者）间移动。
    *   **成功逃亡 (F33-FourEscape)**：
        *   **条件**：已走完三个角色的支线，且其中至少两人的对话进入了“深层” (`DeepTalk`)。
        *   **逻辑**：`(talkedToNun && talkedToKnight && talkedToScholar) && (nunDeepTalk + knightDeepTalk + scholarDeepTalk >= 2)`。

---

## 第一章：新的女王 (Chapter 1)

### 核心变量与 Flag
| Flag 变量 | 含义 | 设置位置 | 影响 |
| :--- | :--- | :--- | :--- |
| `askedHammondInSuburbs` | 在近郊询问过哈蒙德 | `Day1/01.ts` | 解锁 `06.ts` 中关于哈蒙德的追加情报。 |
| `askedMireisInSuburbs` | 在近郊询问过米瑞斯 | `Day1/01.ts` | 解锁 `06.ts` 中关于马雷家族的追加情报。 |
| `askedGoldenKnightReason` | 在近郊询问过金袍理由 | `Day1/01.ts` | 解锁 `06.ts` 中关于金袍骑士历史的追加情报。 |
| `knight_at_feast` | 谁作为护卫陪同赴宴 | `Day1/10.ts` | 值为 `roderick` 或 `corbin`。影响后续夜巡中的偶遇对象。 |
| `已在红袍初见中注意贾斯珀·马雷` | 是否在人群中注意到贾斯珀 | `Day1/02.ts` | 可能影响后续与马雷家的互动。 |

### 关键分歧点
1.  **入城前的闲聊 (`Day1/01.ts`)**
    *   玩家的选择决定了初始收集到的情报包，这些 Flag 会在 `06.ts`（学者的书房）中被重新检定。
2.  **赴宴护卫的选择 (`Day1/09.ts` -> `Day1/10.ts`)**
    *   **选择罗德里克** -> 设置 `shadow_knight_at_feast: 'roderick'`。
    *   **选择科尔宾** -> 设置 `shadow_knight_at_feast: 'corbin'`。
3.  **红堡夜巡 (Day 1 Recovery & Night Encounters)**
    *   **场景 `11.ts` 中的自动跳转逻辑**：
        *   **最高好感优先**：系统会检定 `affinity_highest`。
        *   **凯安支线 (F111)**：`affinity_highest === "cayane"`。
        *   **科尔宾支线 (F112)**：`affinity_highest === "corbin"` 且 赴宴护卫不是科尔宾。
        *   **罗德里克支线 (F113)**：`affinity_highest === "roderick"` 且 赴宴护卫不是罗德里克。
        *   **贾斯珀支线 (F114)**：`affinity_highest === "jasper"`。
    *   **兜底机制**：若无最高好感，则根据固定顺序依次检定是否由于赴宴导致该角色被排除，最后默认遇到凯安（或第一个符合条件的人）。

---

## 好感度系统 (Affinity System)
*   **计算逻辑**：由 `src/contexts/GameContext.tsx` 管理。
*   **存储位置**：`state.affinity`（Map，键为角色 ID）。
*   **触发方式**：在 `Scene` 的 `choices` 中使用 `affect: { [charId]: value }` 进行加减。

---
*最后更新：2026-04-26*
