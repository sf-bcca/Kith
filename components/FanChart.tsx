import React from 'react';

interface Props {
  onNavigate: (screen: string) => void;
}

const FanChart: React.FC<Props> = ({ onNavigate }) => {
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
            {/* Gen 3 Outer */}
            <path d="M 200,65 A 135,135 0 0 1 335,200 L 370,200 A 170,170 0 0 0 200,30 Z" fill="#93c5fd" opacity="0.4" className="hover:opacity-60 cursor-pointer transition-opacity"></path>
            <path d="M 200,65 A 135,135 0 0 0 65,200 L 30,200 A 170,170 0 0 1 200,30 Z" fill="#f9a8d4" opacity="0.4" className="hover:opacity-60 cursor-pointer transition-opacity"></path>
            
            {/* Gen 2 GP */}
            <path d="M 200,110 A 90,90 0 0 1 290,200 L 335,200 A 135,135 0 0 0 200,65 Z" fill="#60a5fa" opacity="0.6" className="hover:opacity-80 cursor-pointer transition-opacity"></path>
            <path d="M 200,110 A 90,90 0 0 0 110,200 L 65,200 A 135,135 0 0 1 200,65 Z" fill="#f472b6" opacity="0.6" className="hover:opacity-80 cursor-pointer transition-opacity"></path>
            
            {/* Gen 1 Parents */}
            <path d="M 200,155 A 45,45 0 0 1 245,200 L 290,200 A 90,90 0 0 0 200,110 Z" fill="#3b82f6" opacity="0.8" className="hover:opacity-100 cursor-pointer transition-opacity"></path>
            <path d="M 200,155 A 45,45 0 0 0 155,200 L 110,200 A 90,90 0 0 1 200,110 Z" fill="#ec4899" opacity="0.8" className="hover:opacity-100 cursor-pointer transition-opacity"></path>

            {/* Root */}
            <circle cx="200" cy="200" r="45" fill="#135bec" className="hover:brightness-110 cursor-pointer transition-all"></circle>
            <text x="200" y="200" dy=".3em" textAnchor="middle" className="fill-white text-[12px] font-bold pointer-events-none">YOU</text>

            {/* Labels */}
            <text x="200" y="140" textAnchor="middle" className="fill-white text-[9px] font-semibold pointer-events-none">David</text>
            <text x="200" y="90" textAnchor="middle" className="fill-white text-[9px] font-semibold pointer-events-none">Arthur</text>
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
             <button className="bg-white shadow-xl rounded-lg px-3 h-12 flex items-center gap-2 text-primary text-sm font-bold active:scale-95 transition-transform hover:bg-gray-50">
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

      {/* Bottom Card */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-gray-100 z-50">
         <div className="flex flex-col items-center py-2">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full mb-4"></div>
         </div>
         <div className="px-6 pb-10 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-center bg-cover border-4 border-primary/20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD0RQ7-rCXS0oWdk8aysRlYDdiUB9DHdYuT8dULDsdrzhi8rO9OyXKQSjXUtkulu69QQmJOCr1wWR8_Lof248eip_2hEWS-cTzLVFWU8mEUv-wtKt9eJjRhSmBINXqHrbVKb1dLxMJUlbXMGTBrGKrhlR3IJ_hoC317UuYkS5KR5RmNGno8DdLKetKgsoWyN9XHIPJuYo91gyh4oJ9WFp24JO6iI6LvPnA-zoVtrtlnkw5w5LrEWZyTsOm-rhbTZALVB5RIHWJt-fk')" }}></div>
            <div className="flex-1">
               <h4 className="text-xl font-bold leading-none">Arthur Harrison</h4>
               <p className="text-[#4c669a] text-sm mt-1">1892 — 1964</p>
               <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded">Great-Grandfather</span>
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