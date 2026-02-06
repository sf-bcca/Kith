import React, { useEffect, useState } from 'react';
import { TreeService, AncestryData } from '../services/TreeService';
import { FamilyMember } from '../types/family';
import { formatDate } from '../src/utils/dateUtils';

interface Props {
  onNavigate: (screen: string) => void;
  selectedId: string;
  onSelect: (id: string) => void;
  loggedInId?: string;
}

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
    const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
    const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
    const startInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = polarToCartesian(x, y, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
        "M", startOuter.x, startOuter.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
        "L", endInner.x, endInner.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
        "Z"
    ].join(" ");

    return d;
};

const FanChart: React.FC<Props> = ({ onNavigate, selectedId, onSelect, loggedInId }) => {
  const [treeData, setTreeData] = useState<AncestryData | null>(null);

  useEffect(() => {
    const fetchAncestors = async () => {
      try {
        const data = await TreeService.getAncestors(selectedId);
        setTreeData(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAncestors();
  }, [selectedId]);

  if (!treeData) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const { focusPerson, parents, grandparents, greatGrandparents } = treeData;

  // Configuration
  const cx = 200;
  const cy = 200; // Center is at bottom-middle roughly for a 180 degree fan
  // Angles: 180 (Left) to 360 (Right). 270 is Top.

  const centerRadius = 45;
  const widths = [45, 45, 45]; // Thickness of each generation ring

  // Map data to sectors
  const father = parents.find(p => p.gender === 'male');
  const mother = parents.find(p => p.gender === 'female');

  const paternalGF = grandparents.find(gp => father?.parents.includes(gp.id) && gp.gender === 'male');
  const paternalGM = grandparents.find(gp => father?.parents.includes(gp.id) && gp.gender === 'female');
  const maternalGF = grandparents.find(gp => mother?.parents.includes(gp.id) && gp.gender === 'male');
  const maternalGM = grandparents.find(gp => mother?.parents.includes(gp.id) && gp.gender === 'female');

  // Great Grandparents
  const getParentsOf = (person: FamilyMember | undefined) => {
      if (!person) return [undefined, undefined];
      const f = greatGrandparents.find(ggp => person.parents.includes(ggp.id) && ggp.gender === 'male');
      const m = greatGrandparents.find(ggp => person.parents.includes(ggp.id) && ggp.gender === 'female');
      return [f, m];
  };

  const [patGF_F, patGF_M] = getParentsOf(paternalGF);
  const [patGM_F, patGM_M] = getParentsOf(paternalGM);
  const [matGF_F, matGF_M] = getParentsOf(maternalGF);
  const [matGM_F, matGM_M] = getParentsOf(maternalGM);

  const gen1 = [father, mother];
  const gen2 = [paternalGF, paternalGM, maternalGF, maternalGM];
  const gen3 = [patGF_F, patGF_M, patGM_F, patGM_M, matGF_F, matGF_M, matGM_F, matGM_M];

  const renderSector = (
      person: FamilyMember | undefined,
      genIndex: number,
      sectorIndex: number,
      totalSectors: number,
      color: string
    ) => {
      const innerR = centerRadius + (widths.slice(0, genIndex).reduce((a, b) => a + b, 0));
      const outerR = innerR + widths[genIndex];
      const startAngle = 180 + (sectorIndex * (180 / totalSectors));
      const endAngle = 180 + ((sectorIndex + 1) * (180 / totalSectors));

      return (
          <g key={`${genIndex}-${sectorIndex}`} onClick={() => person && onSelect(person.id)}>
            <path
                d={describeArc(cx, cy, innerR, outerR, startAngle, endAngle)}
                fill={person ? color : '#e2e8f0'}
                stroke="white"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            {person && (
                <text
                    x={polarToCartesian(cx, cy, innerR + (widths[genIndex]/2), startAngle + ((endAngle-startAngle)/2)).x}
                    y={polarToCartesian(cx, cy, innerR + (widths[genIndex]/2), startAngle + ((endAngle-startAngle)/2)).y}
                    textAnchor="middle"
                    dy=".3em"
                    fontSize={genIndex === 0 ? "10" : "8"}
                    fill="white"
                    fontWeight="bold"
                    pointerEvents="none"
                    transform={`rotate(0, 0, 0)`}
                >
                    {person.firstName}
                </text>
            )}
          </g>
      );
  };

  return (
    <div className="bg-background-light font-display text-[#0d121b] transition-colors duration-300 min-h-screen">
      {/* Top Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-[#cfd7e7]">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <div 
             onClick={() => onNavigate('Discover')}
             className="text-[#0d121b] flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Fan Chart</h2>
          <div className="flex w-10 items-center justify-end">
            <button className="flex items-center justify-center rounded-full h-10 w-10 text-[#0d121b] hover:bg-gray-200 transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex border-b border-[#cfd7e7] px-4 gap-8 justify-center">
          <button className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-primary pb-3 pt-4">
            <p className="text-sm font-bold leading-normal tracking-wide uppercase">Circular</p>
          </button>
          <button className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#4c669a] hover:text-gray-600 pb-3 pt-4 transition-colors">
            <p className="text-sm font-bold leading-normal tracking-wide uppercase">Tree</p>
          </button>
          <button className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#4c669a] hover:text-gray-600 pb-3 pt-4 transition-colors">
            <p className="text-sm font-bold leading-normal tracking-wide uppercase">List</p>
          </button>
        </div>
      </div>

      <main className="pt-32 pb-40 px-4 min-h-screen flex flex-col items-center overflow-hidden">
        <div className="max-w-md w-full mb-6">
          <h3 className="text-2xl font-bold text-center pt-5">Heritage Visualization</h3>
          <p className="text-[#4c669a] text-sm font-normal leading-normal text-center pt-1">Pinch to zoom or tap a generation to expand</p>
        </div>

        {/* Fan Chart SVG */}
        <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center" style={{ perspective: '1000px' }}>
          <svg className="w-full h-full transform transition-transform duration-500 hover:scale-105" viewBox="0 0 400 400">
            {/* Gen 3 (GGP) */}
            {gen3.map((p, i) => renderSector(p, 2, i, 8, i < 4 ? "#93c5fd" : "#f9a8d4"))}

            {/* Gen 2 (GP) */}
            {gen2.map((p, i) => renderSector(p, 1, i, 4, i < 2 ? "#60a5fa" : "#f472b6"))}
            
            {/* Gen 1 (Parents) */}
            {gen1.map((p, i) => renderSector(p, 0, i, 2, i === 0 ? "#3b82f6" : "#ec4899"))}

            {/* Root */}
            <circle
                cx={cx} cy={cy} r={centerRadius}
                fill="#135bec"
                className="hover:brightness-110 cursor-pointer transition-all"
                onClick={() => onSelect(focusPerson.id)}
            ></circle>
            <text x={cx} y={cy} dy=".3em" textAnchor="middle" className="fill-white text-[12px] font-bold pointer-events-none">YOU</text>

          </svg>

          {/* Controls */}
          <div className="absolute bottom-4 right-0 flex flex-col gap-2">
            <button className="bg-white shadow-xl rounded-full w-12 h-12 flex items-center justify-center text-primary active:scale-95 transition-transform hover:bg-gray-50">
              <span className="material-symbols-outlined">add</span>
            </button>
            <button className="bg-white shadow-xl rounded-full w-12 h-12 flex items-center justify-center text-primary active:scale-95 transition-transform hover:bg-gray-50">
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>
          <div className="absolute bottom-4 left-0">
             <button
                className="bg-white shadow-xl rounded-lg px-3 h-12 flex items-center gap-2 text-primary text-sm font-bold active:scale-95 transition-transform hover:bg-gray-50 disabled:opacity-50"
                onClick={() => loggedInId && onSelect(loggedInId)}
                disabled={!loggedInId}
             >
                <span className="material-symbols-outlined text-[20px]">filter_center_focus</span>
                Recenter
             </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex gap-6 px-4 py-3 bg-white rounded-xl shadow-sm border border-[#cfd7e7]">
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-xs font-medium text-[#4c669a]">Paternal</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500"></span>
              <span className="text-xs font-medium text-[#4c669a]">Maternal</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-300"></span>
              <span className="text-xs font-medium text-[#4c669a]">Missing</span>
           </div>
        </div>
      </main>

      {/* Bottom Card for Selected Person */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-gray-100 z-50">
         <div className="flex flex-col items-center py-2">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full mb-4"></div>
         </div>
         <div className="px-6 pb-10 flex items-center gap-4">
            <div
                className="w-20 h-20 rounded-full bg-center bg-cover border-4 border-primary/20 flex items-center justify-center bg-gray-100"
                style={{ backgroundImage: focusPerson.photoUrl ? `url('${focusPerson.photoUrl}')` : undefined }}
            >
                {!focusPerson.photoUrl && <span className="material-symbols-outlined text-4xl text-gray-400">person</span>}
            </div>
            <div className="flex-1">
               <h4 className="text-xl font-bold leading-none">{focusPerson.firstName} {focusPerson.lastName}</h4>
               <p className="text-[#4c669a] text-sm mt-1">{formatDate(focusPerson.birthDate)} — {focusPerson.deathDate ? formatDate(focusPerson.deathDate) : 'Present'}</p>
               <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded">Person</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">Verified</span>
               </div>
            </div>
            <button className="bg-primary text-white p-3 rounded-full shadow-lg shadow-primary/30 hover:bg-blue-600 transition-colors">
               <span className="material-symbols-outlined">person_search</span>
            </button>
         </div>
      </div>
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-30 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default FanChart;