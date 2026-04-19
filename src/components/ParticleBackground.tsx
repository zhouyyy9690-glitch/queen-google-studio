import { motion } from 'framer-motion';
import { useMemo } from 'react';

export type ParticleType = 'snow' | 'dust' | 'evening' | 'nature' | 'ink' | 'none';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

// 粒子背景组件：根据传入的 type 渲染不同的环境特效（雪花、尘埃、夕阳光辉、萤火虫等）
const ParticleBackground = ({ type }: { type: ParticleType }) => {
  // 生成粒子数据，并在类型改变时重新计算
  const particles = useMemo(() => {
    if (type === 'none') return [];
    
    const count = (type === 'nature' || type === 'evening') ? 30 : 25;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // 初始 X 坐标 (百分比)
      y: Math.random() * 100, // 初始 Y 坐标 (百分比)
      size: Math.random() * (type === 'nature' || type === 'evening' ? 4 : 2) + 1, // 粒子大小
      duration: Math.random() * 10 + 10, // 动画持续时间
      delay: Math.random() * -20, // 负延迟使动画立即在随机位置开始
      opacity: Math.random() * (type === 'evening' ? 0.3 : 0.4) + 0.1, // 透明度
    }));
  }, [type]);

  if (type === 'none') return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: 
              type === 'snow' ? '#ffffff' : // 白色雪花
              type === 'dust' ? '#d97706' : // 琥珀色尘埃
              type === 'evening' ? '#f59e0b' : // 暮色中的金橘色光粒
              type === 'nature' ? '#14b8a6' : // 翠谷中的翡翠色萤火虫
              '#e5e5e5', // 默认浅灰色（用于煤灰等）
            boxShadow: (type === 'nature' || type === 'evening') ? `0 0 4px ${type === 'nature' ? '#10b981' : '#d97706'}` : 'none',
            opacity: p.opacity,
            filter: (type === 'dust' || type === 'evening') ? 'blur(1px)' : 'none',
          }}
          animate={
            type === 'snow' ? {
              // 雪花向下飘落逻辑
              y: ['0vh', '100vh'],
              x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`],
            } : (type === 'dust' || type === 'evening') ? {
              // 尘埃/光影随机漂浮逻辑
              y: [`${p.y}%`, `${p.y + (Math.random() * 20 - 10)}%`],
              x: [`${p.x}%`, `${p.x + (Math.random() * 20 - 10)}%`],
              opacity: [p.opacity, p.opacity * 0.5, p.opacity],
            } : type === 'nature' ? {
              // 萤火虫无规则飞行与闪烁逻辑
              scale: [1, 1.2, 1],
              opacity: [p.opacity, p.opacity * 1.5, p.opacity],
              x: [
                `${p.x}%`, 
                `${p.x + (Math.random() * 15 - 7.5)}%`,
                `${p.x - (Math.random() * 15 - 7.5)}%`,
                `${p.x}%`
              ],
              y: [
                `${p.y}%`, 
                `${p.y - (Math.random() * 10 + 5)}%`,
                `${p.y + (Math.random() * 5)}%`,
                `${p.y}%`
              ],
            } : {
              // 灰烬升腾逻辑
              y: [`${p.y}%`, `${p.y - (Math.random() * 40 + 20)}%`],
              opacity: [0, p.opacity, 0],
              scale: [0, 1.5, 0.5],
              x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`],
            }
          }
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      
      {/* Light ray effect for City/Citadel and Sunset */}
      {type === 'dust' && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent" />
      )}
      {type === 'evening' && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-transparent opacity-60" />
      )}
    </div>
  );
};

export default ParticleBackground;
