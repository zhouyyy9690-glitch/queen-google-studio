import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scroll, X, Shield, MessageSquare, MapPin, Book } from 'lucide-react';
import { OrnateCorner } from './OrnateCorner';
import { Location as GameLocation, Insight } from '../types';

/**
 * 装饰性组件：地图上的流动云朵，增强氛围感
 */
const FloatingClouds = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen opacity-40">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`,
            opacity: 0.1 + Math.random() * 0.3,
            scale: 1 + Math.random() * 2
          }}
          animate={{ 
            x: ['-20%', '120%'],
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`]
          }}
          transition={{ 
            duration: 40 + Math.random() * 60, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute w-64 h-32 bg-white blur-[60px] rounded-[100%]"
        />
      ))}
    </div>
  );
};

/**
 * 地图战争迷雾组件：根据解锁地点动态揭开地图覆盖层
 */
const MapFogOfWar = ({ unlockedLocations, locations }: { unlockedLocations: Set<string>, locations: GameLocation[] }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <svg className="w-full h-full">
        <defs>
          <mask id="fog-mask">
            <rect width="100%" height="100%" fill="white" />
            {locations.map(loc => {
              if (!unlockedLocations.has(loc.id)) return null;
              return (
                <circle 
                  key={`reveal-${loc.id}`}
                  cx={`${loc.x}%`} 
                  cy={`${loc.y}%`} 
                  r={loc.isRegionLabel ? "250" : "150"} 
                  fill="black" 
                  className="blur-3xl"
                />
              );
            })}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="#2a1b0a" mask="url(#fog-mask)" className="opacity-80" />
      </svg>
    </div>
  );
};

/**
 * 世界地图组件属性定义
 */
interface WorldMapProps {
  showMap: boolean; // 是否显示地图
  setShowMap: (val: boolean) => void; // 切换地图显示状态
  unlockedLocations: Set<string>; // 已解锁地点 ID 集合
  locations: GameLocation[]; // 地点数据列表
  currentPath: 'fox' | 'deer' | 'eagle' | 'destiny' | 'all' | 'common' | null; // 当前剧情路径
  mapRef: React.RefObject<HTMLDivElement>; // 地图容器引用，用于处理缩放偏移
  handleMapZoom: (e: React.WheelEvent) => void; // 处理地图缩放
  mapX: any; // 地图 X 轴平移量（MotionValue）
  mapY: any; // 地图 Y 轴平移量（MotionValue）
  mapScale: any; // 地图原始缩放比例
  mapScaleSpring: any; // 带物理效果的地图缩放比例
  mapTilt: any; // 地图倾斜角度
  mapPerspectiveOffset: any; // 视角透视偏移量
  cloudX: any; // 云层 X 轴偏移
  cloudY: any; // 云层 Y 轴偏移
  labelX: any; // 标签 X 轴偏移
  labelY: any; // 标签 Y 轴偏移
  mapObjectHeight: any; // 地图物品高度（3D 效果）
  mapObjectOpacity: any; // 地图物品透明度（随缩放变化）
  mapObjectScale: any; // 地图物品大小（随缩放变化）
  setSelectedLocationId: (id: string | null) => void; // 设置选中的地点
  selectedLocationId: string | null; // 当前选中的地点 ID
  selectedLocation: GameLocation | null; // 当前选中的地点对象
  insights: Insight[]; // 传闻/见地列表
  unlockedInsights: Set<string>; // 已解锁的传闻 ID
}

/**
 * 全局世界地图组件：
 * 一个高度交互的 3D 地图系统，支持平移、缩放、战争迷雾效果。
 * 当玩家选择特定地点时，会从侧边滑动显示地点志内容。
 */
export const WorldMap = ({
  showMap,
  setShowMap,
  unlockedLocations,
  locations,
  currentPath,
  mapRef,
  handleMapZoom,
  mapX,
  mapY,
  mapScale,
  mapScaleSpring,
  mapTilt,
  mapPerspectiveOffset,
  cloudX,
  cloudY,
  labelX,
  labelY,
  mapObjectHeight,
  mapObjectOpacity,
  mapObjectScale,
  setSelectedLocationId,
  selectedLocationId,
  selectedLocation,
  insights,
  unlockedInsights
}: WorldMapProps) => {
  return (
    <>
      {/* 王国大地图遮罩层 */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            className="fixed inset-0 z-[150] bg-[#050505] overflow-hidden flex items-center justify-center"
          >
            {/* Background Textures matching ChapterSelectModal */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,20,10,0.3)_0%,transparent_100%)] pointer-events-none" />

            <div className="w-full h-full md:m-8 lg:m-12 relative flex flex-col bg-[#0c0c0c] border border-amber-900/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Ornate Corners */}
              <OrnateCorner position="tl" />
              <OrnateCorner position="tr" />
              <OrnateCorner position="bl" />
              <OrnateCorner position="br" />

              {/* 顶部标题与交互说明 - Floating top bar */}
              <div className="absolute top-0 left-0 right-0 z-[160] px-12 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <div className="flex items-center gap-4 pointer-events-auto">
                  <Scroll className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 drop-shadow-[0_0_8px_rgba(5,150,105,0.4)]" />
                  <h3 className="font-display text-xl md:text-2xl text-emerald-600 tracking-widest uppercase drop-shadow-md">征服王国全图 · World Map</h3>
                </div>
                <div className="flex items-center gap-6 pointer-events-auto">
                  <div className="hidden lg:flex items-center gap-3 text-[10px] text-emerald-100/30 uppercase tracking-widest bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm border border-emerald-900/10">
                    <span>滚轮缩放 / Zoom</span>
                    <span className="w-px h-3 bg-emerald-900/10" />
                    <span>拖拽移动 / Pan</span>
                  </div>
                  <button 
                    onClick={() => {
                      setShowMap(false);
                      mapScale.set(1);
                      setSelectedLocationId(null);
                    }}
                    className="bg-black/40 hover:bg-black/60 text-neutral-400 hover:text-neutral-100 transition-all uppercase tracking-widest text-[10px] md:text-xs cursor-pointer px-6 py-2 rounded-full border border-white/5 backdrop-blur-sm"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* 地图交互区域 */}
              <div 
                ref={mapRef}
                className="flex-grow w-full h-full relative bg-[#1c120a] overflow-hidden cursor-grab active:cursor-grabbing"
                onWheel={handleMapZoom}
                style={{ 
                  perspective: '2000px',
                  WebkitFontSmoothing: 'antialiased'
                }}
              >
                {/* 3D 交互式地图页卷 */}
                <motion.div 
                  drag
                  dragConstraints={{ 
                    left: -2000, 
                    right: 2000, 
                    top: -2000, 
                    bottom: 2000 
                  }}
                  dragTransition={{ bounceStiffness: 200, bounceDamping: 30, power: 0.15 }}
                  dragElastic={0.02}
                  style={{ 
                    x: mapX, 
                    y: mapY, 
                    scale: mapScaleSpring,
                    rotateX: mapTilt,
                    perspective: mapPerspectiveOffset,
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(0)' 
                  }}
                  className="absolute inset-[-150%] origin-center will-change-transform bg-[#d4a85a]"
                >
                  {/* 背景纹理：旧纸张效果 */}
                  <div className="absolute inset-0 pointer-events-none opacity-60 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/old-map.png')]" />
                  <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

                  {/* 地图核心内容 - 以中心为原点的空间 */}
                  <div className="absolute inset-0 min-w-[2000px] min-h-[1600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d' }}>
                    <MapFogOfWar unlockedLocations={unlockedLocations} locations={locations} />
                    <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
                      {/* 陆地基准阴影 - 增强 3D 浮雕感 */}
                      <path 
                        d="M 500 400 c 100 -100 300 -40 400 -100 s 200 -160 400 -100 s 300 100 400 200 s 100 300 0 500 s -200 400 -400 500 s -400 100 -600 200 s -300 -100 -400 -300 s -100 -400 0 -600 s 100 -200 200 -300" 
                        fill="rgba(0,0,0,0.15)" 
                        className="blur-xl"
                        transform="translate(25, 25)"
                      />
                      {/* 装饰边框与地理信息 */}
                      <g className="pointer-events-none opacity-40">
                        {/* 南部边界线条 */}
                        <path 
                          d="M 300 650 q 50 -20 200 -20 t 350 40 t 250 150 v 200 q -100 50 -300 80 t -400 -50 Z" 
                          fill="none" 
                          stroke="#8b4513" 
                          strokeWidth="1.2" 
                          strokeDasharray="10 5"
                          className="text-amber-900/10"
                        />
                        
                        {/* 翠绿峡谷边界（仅解锁时显示） */}
                        {unlockedLocations.has('verdant_vale') && (
                          <motion.path 
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            d="M 460 540 c -40 20 -60 60 -40 120 s 40 80 80 60 s 60 -40 40 -120 s -40 -80 -80 -60 Z" 
                            fill="url(#emerald-glow)" 
                            fillOpacity="0.03"
                            stroke="#065f46" 
                            strokeWidth="1.5" 
                            strokeDasharray="5 3"
                            className="text-emerald-900/30"
                          />
                        )}

                        {/* 简易中世纪风格坐标参考线 */}
                        <path d="M 350 100 q 150 -30 350 0 t 300 50" fill="none" stroke="#8b4513" strokeWidth="1" strokeDasharray="15 10" className="opacity-10"/>
                        <path d="M 150 350 q 50 150 0 300" fill="none" stroke="#8b4513" strokeWidth="1" strokeDasharray="15 10" className="opacity-10"/>
                        <path d="M 950 300 q 80 150 0 350" fill="none" stroke="#8b4513" strokeWidth="1" strokeDasharray="15 10" className="opacity-10"/>
                      </g>

                      <defs>
                        <radialGradient id="emerald-glow">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                        <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
                          <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#8b4513" strokeWidth="0.5" strokeDasharray="4 4"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* 地点隶属关系连线 */}
                      <g className="text-[#8b4513]/40" stroke="currentColor" fill="none" strokeWidth="0.8" strokeDasharray="3 3" style={{ transformStyle: 'preserve-3d' }}>
                        {locations.map(loc => {
                          if (loc.parentId) {
                            const parent = locations.find(p => p.id === loc.parentId);
                            if (parent && unlockedLocations.has(loc.id)) {
                              return (
                                <line 
                                  key={`link-${loc.id}`}
                                  x1={`${parent.x}%`} 
                                  y1={`${parent.y}%`}
                                  x2={`${loc.x}%`} 
                                  y2={`${loc.y}%`}
                                  className="opacity-40"
                                  style={{ transform: 'translateZ(20px)' }}
                                />
                              );
                            }
                          }
                          return null;
                        })}
                      </g>

                      {/* 陆地轮廓手绘线条 */}
                      <path 
                        d="M 300 200 c 50 -50 150 -20 200 -50 s 100 -80 200 -50 s 150 50 200 100 s 50 150 0 250 s -100 200 -200 250 s -200 50 -300 100 s -150 -50 -200 -150 s -50 -200 0 -300 s 50 -100 100 -150" 
                        fill="#fdf5e6" 
                        stroke="#5d4037" 
                        strokeWidth="3" 
                        strokeLinejoin="round"
                        className="opacity-40"
                      />

                      {/* 地形：山脉符号 */}
                      <g className="text-[#5d4037]/60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {/* 北方山脉 */}
                        {[
                          {x: 420, y: 120}, {x: 450, y: 100}, {x: 480, y: 130},
                          {x: 550, y: 90}, {x: 580, y: 110}, {x: 610, y: 80}
                        ].map((p, i) => (
                          <g key={`mtn-n-${i}`} transform={`translate(${p.x}, ${p.y})`}>
                            <path d="M -15 20 L 0 -15 L 15 20" />
                            <path d="M -5 5 L 5 5 M -3 10 L 3 10" strokeWidth="0.5" />
                          </g>
                        ))}
                        
                        {/* 东方山脉 */}
                        {[
                          {x: 850, y: 420}, {x: 870, y: 450}, {x: 840, y: 480}
                        ].map((p, i) => (
                          <g key={`mtn-e-${i}`} transform={`translate(${p.x}, ${p.y})`}>
                            <path d="M -12 18 L 0 -12 L 12 18" />
                            <path d="M -4 4 L 4 4" strokeWidth="0.5" />
                          </g>
                        ))}
                      </g>

                      {/* 地形：河流符号 */}
                      <g className="text-[#4e342e]/30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M 520 380 c 20 40 -10 80 30 130 s 0 100 40 150" />
                        <path d="M 480 420 c -30 30 10 70 -20 110" />
                      </g>

                      {/* 地形：森林符号 */}
                      <g className="text-[#3e2723]/40">
                        {[
                          {x: 410, y: 760}, {x: 435, y: 775}, {x: 460, y: 755},
                          {x: 540, y: 830}, {x: 565, y: 845}, {x: 590, y: 825},
                          {x: 780, y: 550}, {x: 805, y: 565},
                          {x: 530, y: 580}, {x: 550, y: 600}, {x: 570, y: 570},
                          {x: 520, y: 610}, {x: 580, y: 620}
                        ].map((p, i) => (
                          <g key={`tree-${i}`} transform={`translate(${p.x}, ${p.y})`}>
                            <line x1="0" y1="0" x2="0" y2="12" stroke="currentColor" strokeWidth="1.5" />
                            <circle cx="0" cy="0" r="5" fill="currentColor" stroke="none" />
                          </g>
                        ))}
                      </g>

                      {/* 互动标志：海浪与装饰符号 */}
                      <g className="text-[#5d4037]/30" fill="none" stroke="currentColor" strokeWidth="1">
                        {[
                          {x: 100, y: 350}, {x: 150, y: 380}, {x: 120, y: 420},
                          {x: 1050, y: 320}, {x: 1100, y: 350}, {x: 1080, y: 400},
                          {x: 200, y: 150}, {x: 950, y: 750}
                        ].map((p, i) => (
                          <path key={`wave-${i}`} d={`M ${p.x} ${p.y} c 5 -3 10 3 15 0 m 5 0 c 5 -3 10 3 15 0`} />
                        ))}
                      </g>

                      <g transform="translate(250, 650) scale(0.8)" className="text-[#5d4037]/50" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M 0 20 L 60 20 L 50 40 L 10 40 Z" fill="currentColor" fillOpacity="0.1" />
                        <line x1="30" y1="20" x2="30" y2="-20" />
                        <path d="M 30 -20 L 60 10 L 30 10 Z" fill="currentColor" fillOpacity="0.2" />
                      </g>

                      <g transform="translate(100, 550) scale(0.6)" className="text-[#5d4037]/30" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M 0 0 c 20 -20 40 0 20 40 s -60 20 -60 -20 s 40 -60 80 -20 s 20 80 -40 100" />
                      </g>

                      {/* 整体边框 */}
                      <rect x="20" y="20" width="1160" height="860" fill="none" stroke="#5d4037" strokeWidth="4" className="opacity-20" />
                      <rect x="30" y="30" width="1140" height="840" fill="none" stroke="#5d4037" strokeWidth="1" className="opacity-10" />
                    </svg>

                    {/* 视差效果云层 */}
                    <motion.div style={{ x: cloudX, y: cloudY }} className="absolute inset-[-50%] pointer-events-none">
                      <FloatingClouds count={8} />
                    </motion.div>

                    {/* 所有地点点位与大区标签 */}
                    {locations
                      .filter(loc => !loc.path || loc.path === 'all' || loc.path === currentPath)
                      .map((loc) => {
                        const isUnlocked = unlockedLocations.has(loc.id);
                        if (!loc.isRegionLabel && !isUnlocked) return null;

                        const parent = loc.parentId ? locations.find(p => p.id === loc.parentId) : null;
                        const vectorX = parent ? (loc.x - parent.x) : (loc.x - 50);
                        const vectorY = parent ? (loc.y - parent.y) : (loc.y - 50);
                        const zDepth = loc.isRegionLabel ? (loc.isSubRegion ? 120 : 180) : 60;

                        return (
                          <motion.div
                            key={loc.id}
                            style={{ 
                              left: `${loc.x}%`, 
                              top: `${loc.y}%`,
                              x: labelX,
                              y: labelY,
                              z: zDepth,
                              translateX: `calc(var(--map-sep-factor, 0) * ${vectorX * 2.5}px)`,
                              translateY: `calc(var(--map-sep-factor, 0) * ${vectorY * 2.5}px)`,
                              scale: `calc(1 / pow(var(--map-scale-val, 1), 0.4))`,
                              transformStyle: 'preserve-3d'
                            } as any}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 will-change-transform"
                          >
                            <button 
                              onClick={() => isUnlocked && setSelectedLocationId(loc.id)}
                              className={`relative flex flex-col items-center group transition-all ${isUnlocked ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
                            >
                              {loc.isRegionLabel ? (
                                <div className={`transition-all duration-700 ${
                                  loc.isSubRegion ? 'px-6 py-2' : 'px-8 py-4'
                                } ${isUnlocked ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                                  <h2 className={`${
                                    loc.isSubRegion ? 'text-[12px] md:text-sm text-emerald-900/60' : 'text-xl md:text-2xl text-amber-950/20'
                                  } font-display tracking-[0.6em] md:tracking-[0.8em] uppercase whitespace-nowrap drop-shadow-sm select-none`}>
                                    {loc.name}
                                  </h2>
                                  {loc.isSubRegion && isUnlocked && (
                                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-px bg-gradient-to-r from-transparent via-emerald-800/30 to-transparent mt-1" />
                                  )}
                                </div>
                              ) : (
                                <div className="flex flex-col items-center" style={{ transformStyle: 'preserve-3d' }}>
                                  {/* 抽象精雕：仅在深度缩放时显现的地标符号 */}
                                  {isUnlocked && (
                                    <motion.div 
                                      style={{ 
                                        z: mapObjectHeight,
                                        rotateX: -mapTilt, 
                                        opacity: mapObjectOpacity,
                                        scale: mapObjectScale,
                                        transformStyle: 'preserve-3d'
                                      }}
                                      className="absolute bottom-[10%] flex items-end justify-center pointer-events-none will-change-transform"
                                    >
                                      {/* 地标视觉分类渲染 */}
                                      {(loc.id.includes('castle') || loc.name.includes('堡') || loc.name.includes('都') || loc.name.includes('塞')) ? (
                                        <div className="relative flex items-end gap-1" style={{ transformStyle: 'preserve-3d' }}>
                                          <div className="w-[1.5px] h-20 bg-gradient-to-t from-amber-950 to-transparent" />
                                          <div className="w-[2.5px] h-32 bg-gradient-to-t from-amber-950 via-amber-800 to-transparent relative">
                                             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full blur-[2px] opacity-70" />
                                          </div>
                                          <div className="w-[1.5px] h-24 bg-gradient-to-t from-amber-950 to-transparent" />
                                        </div>
                                      ) : (loc.id.includes('valley') || loc.id.includes('forest') || loc.name.includes('谷') || loc.name.includes('林')) ? (
                                        <div className="flex items-end justify-center" style={{ transformStyle: 'preserve-3d' }}>
                                          {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-8 h-12 bg-emerald-950/20 border-l border-emerald-900/40" 
                                              style={{ 
                                                clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                                                transform: `scale(${0.4 + (i * 0.2)}) translateZ(${i * 8 - 16}px) translateX(${i * -6 + 9}px) rotateY(${i * 15}deg)`,
                                                filter: 'contrast(1.2) brightness(0.8)',
                                                mixBlendMode: 'multiply'
                                              }} 
                                            />
                                          ))}
                                        </div>
                                      ) : (loc.id.includes('port') || loc.name.includes('港') || loc.name.includes('码')) ? (
                                        <div className="flex flex-col items-center" style={{ transformStyle: 'preserve-3d' }}>
                                           <div className="w-[1px] h-16 bg-amber-950/40 relative">
                                              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-amber-950/30" />
                                              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-6 h-[1px] bg-amber-900/30" />
                                           </div>
                                        </div>
                                      ) : (
                                        <div className="w-[1px] h-12 bg-amber-900/20 relative">
                                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 border border-amber-900/40 rotate-45" />
                                        </div>
                                      )}
                                    </motion.div>
                                  )}

                                  {/* 地点点位标记（固定在纸面） */}
                                  <div className="relative">
                                    <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                      className={`w-3 h-3 rounded-full mb-1 blur-[1.5px] ${isUnlocked ? 'bg-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.9)]' : 'bg-neutral-600'}`} />
                                    <div className={`w-1.5 h-1.5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isUnlocked ? 'bg-white' : 'bg-neutral-400'}`} />
                                  </div>
                                  <p className={`mt-1 text-[10px] md:text-sm font-display tracking-[0.2em] uppercase whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] ${isUnlocked ? 'text-[#3e2723] font-bold' : 'text-neutral-600'}`}>
                                    {loc.name}
                                  </p>
                                </div>
                              )}
                            </button>
                          </motion.div>
                        );
                      })}

                    {/* 指南针装饰 */}
                    <div className="absolute top-12 left-12 opacity-40 pointer-events-none">
                      <svg width="140" height="140" viewBox="0 0 100 100" className="text-[#5d4037]">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
                        <path d="M 50 10 L 55 45 L 50 50 L 45 45 Z" fill="currentColor" />
                        <path d="M 50 90 L 55 55 L 50 50 L 45 55 Z" fill="currentColor" />
                        <path d="M 90 50 L 55 55 L 50 50 L 55 45 Z" fill="currentColor" />
                        <path d="M 10 50 L 45 55 L 50 50 L 45 45 Z" fill="currentColor" />
                        <path d="M 25 25 L 50 50 L 30 30 Z" fill="currentColor" opacity="0.5" />
                        <path d="M 75 25 L 50 50 L 70 30 Z" fill="currentColor" opacity="0.5" />
                        <path d="M 25 75 L 50 50 L 30 70 Z" fill="currentColor" opacity="0.5" />
                        <path d="M 75 75 L 50 50 L 70 70 Z" fill="currentColor" opacity="0.5" />
                        <text x="50" y="8" textAnchor="middle" fontSize="10" fill="currentColor" className="font-display font-bold">N</text>
                        <text x="50" y="98" textAnchor="middle" fontSize="10" fill="currentColor" className="font-display font-bold">S</text>
                        <text x="96" y="54" textAnchor="middle" fontSize="10" fill="currentColor" className="font-display font-bold">E</text>
                        <text x="4" y="54" textAnchor="middle" fontSize="10" fill="currentColor" className="font-display font-bold">W</text>
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <div className="mt-8 text-center pb-8">
                <p className="text-[10px] text-amber-900/40 font-display uppercase tracking-[0.5em]">
                  — 随着你的脚步，王国的疆域正逐渐清晰 —
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 地点志详情侧边栏 */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-96 bg-[#0a0a0a] border-l border-amber-900/20 z-[200] shadow-2xl p-8 flex flex-col overflow-y-auto no-scrollbar"
          >
            <button 
              onClick={() => setSelectedLocationId(null)}
              className="absolute top-8 right-8 text-neutral-500 hover:text-neutral-100 transition-colors p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mt-16 space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] text-emerald-500/60 uppercase tracking-[0.3em] font-display">
                  {selectedLocation.faction}
                </span>
                <h4 className="text-4xl text-amber-600 font-display tracking-wider">
                  {selectedLocation.name}
                </h4>
              </div>

              <div className="h-px bg-gradient-to-r from-amber-900/40 to-transparent" />

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-amber-900/60">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest">领地掌权者 · Ruler</span>
                </div>
                <p className="text-neutral-300 font-serif italic text-lg leading-relaxed">
                  {selectedLocation.ruler || selectedLocation.faction}
                </p>
              </div>

              {/* 地点相关的流言蜚语（需已在剧情中解锁） */}
              {insights.filter(ins => ins.locationId === selectedLocation.id).length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-900/60">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest">领地传闻 · Rumors</span>
                  </div>
                  <ul className="space-y-4">
                    {insights
                      .filter(ins => ins.locationId === selectedLocation.id)
                      .map((insight) => {
                        if (!unlockedInsights.has(insight.id)) return null;
                        return (
                          <li key={insight.id} className="text-neutral-400 font-serif italic text-sm leading-relaxed flex flex-col gap-1 border-l border-amber-900/10 pl-4 py-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-amber-600/60 text-[10px] uppercase tracking-widest font-display">{insight.title}</span>
                            </div>
                            <p className="text-neutral-300/80">{insight.description}</p>
                          </li>
                        );
                      })}
                  </ul>
                  {insights
                    .filter(ins => ins.locationId === selectedLocation.id)
                    .every(ins => !unlockedInsights.has(ins.id)) && (
                    <p className="text-[10px] text-neutral-600 italic">暂无搜集到相关传闻。</p>
                  )}
                </div>
              )}

              <div className="h-px bg-amber-900/10" />

              {selectedLocation.region && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-amber-900/60">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest">所属区域 · Region</span>
                  </div>
                  <p className="text-neutral-300 font-serif italic text-lg leading-relaxed">
                    {selectedLocation.region}
                  </p>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-amber-900/60">
                  <Book className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest">地点志 · Description</span>
                </div>
                <p className="text-neutral-400 font-serif italic leading-relaxed text-base">
                  {selectedLocation.description}
                </p>
              </div>
            </div>

            <div className="mt-auto pt-12">
              <div className="p-6 border border-amber-900/10 bg-amber-900/5 rounded-sm">
                <p className="text-[10px] text-amber-900/40 uppercase tracking-widest leading-relaxed">
                  此地的历史已与您的旅程交织。每一个被踏足的角落，都见证了权力的更迭与命运的流转。
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
