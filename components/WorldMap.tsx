import React from 'react';

interface Point {
  x: number;
  y: number;
  label?: string;
  color?: string;
  id: string;
}

interface Path {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  id: string;
}

interface Props {
  points: Point[];
  paths: Path[];
  onPointClick?: (id: string) => void;
}

const WorldMap: React.FC<Props> = ({ points, paths, onPointClick }) => {
  const [viewBox, setViewBox] = React.useState({ x: 0, y: 0, w: 800, h: 400 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [lastPos, setLastPos] = React.useState({ x: 0, y: 0 });

  // SVG dimensions
  const width = 800;
  const height = 400;

  const handleZoom = (factor: number) => {
    setViewBox(prev => {
      const newW = prev.w * factor;
      const newH = prev.h * factor;
      // Keep center the same
      const dx = (prev.w - newW) / 2;
      const dy = (prev.h - newH) / 2;
      return {
        x: Math.max(-200, Math.min(width, prev.x + dx)),
        y: Math.max(-100, Math.min(height, prev.y + dy)),
        w: Math.max(100, Math.min(width * 2, newW)),
        h: Math.max(50, Math.min(height * 2, newH))
      };
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    
    // Scale movement by zoom level
    const scale = viewBox.w / width;
    
    setViewBox(prev => ({
      ...prev,
      x: prev.x - dx * scale,
      y: prev.y - dy * scale
    }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative w-full aspect-[2/1] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 cursor-move">
      <svg 
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`} 
        className="w-full h-full select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Stylized World Map Background (Simple continents representation) */}
        <g fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.5">
          {/* North America */}
          <path d="M100,50 L250,50 L280,150 L200,200 L100,180 Z" />
          {/* South America */}
          <path d="M200,200 L280,220 L250,350 L200,380 L180,300 Z" />
          {/* Eurasia */}
          <path d="M350,50 L750,50 L780,200 L600,250 L400,200 L350,150 Z" />
          {/* Africa */}
          <path d="M380,180 L480,180 L520,300 L450,380 L380,350 Z" />
          {/* Australia */}
          <path d="M650,280 L750,280 L780,350 L700,380 L650,350 Z" />
        </g>

        {/* Migration Paths */}
        {paths.map((path) => (
          <path
            key={path.id}
            d={`M${path.from.x},${path.from.y} Q${(path.from.x + path.to.x) / 2},${Math.min(path.from.y, path.to.y) - 20} ${path.to.x},${path.to.y}`}
            fill="none"
            stroke={path.color || "#ec4899"}
            strokeWidth="1.5"
            strokeDasharray="4,2"
            className="opacity-60"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="20"
              to="0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        ))}

        {/* Origin Points */}
        {points.map((point) => (
          <g 
            key={point.id} 
            className="cursor-pointer group"
            onClick={() => onPointClick?.(point.id)}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={point.color || "#ec4899"}
              className="group-hover:scale-150 transition-transform duration-200 shadow-lg"
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill={point.color || "#ec4899"}
              className="animate-ping opacity-20"
            />
            {/* Tooltip-like Label (simplified) */}
            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              className="text-[8px] font-bold fill-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      
      {/* Legend / Overlay */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Birth Place</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t border-dashed border-pink-400"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Migration Path</span>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button 
          onClick={() => handleZoom(0.8)}
          className="size-8 bg-white/90 backdrop-blur shadow-sm rounded-lg flex items-center justify-center text-slate-600 hover:bg-white active:scale-95 transition-all border border-slate-200"
        >
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
        <button 
          onClick={() => handleZoom(1.2)}
          className="size-8 bg-white/90 backdrop-blur shadow-sm rounded-lg flex items-center justify-center text-slate-600 hover:bg-white active:scale-95 transition-all border border-slate-200"
        >
          <span className="material-symbols-outlined text-sm">remove</span>
        </button>
        <button 
          onClick={() => setViewBox({ x: 0, y: 0, w: 800, h: 400 })}
          className="size-8 bg-white/90 backdrop-blur shadow-sm rounded-lg flex items-center justify-center text-slate-600 hover:bg-white active:scale-95 transition-all border border-slate-200"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
        </button>
      </div>
    </div>
  );
};

export default WorldMap;