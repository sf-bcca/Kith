import React from 'react';

interface Props {
  onNavigate: (screen: string) => void;
}

const PedigreeChart: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col overflow-hidden">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200">
        <button 
          onClick={() => onNavigate('Discover')}
          className="flex items-center justify-center p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">Pedigree Chart</h1>
        <div className="flex gap-2">
          <button className="flex items-center justify-center p-2 hover:bg-slate-100 rounded-full transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </header>

      {/* Tree Area */}
      <main className="flex-1 overflow-auto relative p-6 pb-32 flex flex-col items-center justify-end">
        <div className="flex flex-col-reverse items-center min-w-max mx-auto space-y-reverse space-y-8">
          {/* Level 0: Focus Person */}
          <div className="flex flex-col items-center z-10">
            <div className="relative group cursor-pointer hover:scale-105 transition-transform">
              {/* Connector up */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-primary"></div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-lg border-2 border-primary w-64">
                <div className="size-12 rounded-full overflow-hidden bg-slate-200">
                  <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOpNN5yVahrXq0LD134v_xm3XCie_E86p1nR2HJtoiv0DNszDybE0gx8rcSSVPvdm7QRoaRAyHJgTwlYI8pdKYq1PZUd9XlFsIP94uNN7brqMtNz3aEDJF4Xzhk16gJ-25a29crKnThHXILdiM5yA4koZ9FJClmA57VgMGwpb2NarAvI-Y8qCHXW_sEKmYzymOuzESIteI5utDMG_LRvymLrkgMHZ50Al-WAnspgLx81ENETfklFISKc4kGNoWDM4Ezcwv62o86mk" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">John Doe (You)</span>
                  <span className="text-xs text-slate-500">1985 - Present</span>
                </div>
              </div>
            </div>
          </div>

          {/* Level 1: Parents */}
          <div className="relative flex flex-col items-center">
            {/* Horizontal Connector */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full max-w-[320px] h-0.5 bg-slate-200 -z-10"></div>
            
            <div className="flex gap-16">
               {/* Father */}
               <div className="flex flex-col items-center relative group cursor-pointer hover:scale-105 transition-transform">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-primary"></div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-md border border-slate-100 w-56">
                    <div className="size-10 rounded-full overflow-hidden bg-slate-200">
                      <img alt="Father" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW8iy-7ZzCAbUllVtbNktqUCo_fAJSwA2BjZDRdzp__hPFHc8FgdTmj0ES6Q0tRnJLRd7gejvWn3dzAgzKdbKOjkDsMJjE-MYGe2dJi5SVZt_U_T2olcF7a12iINsIND2WXvLJQH_9qSJZb_MYL1q3JpK4umavvVp9JYsLCLIVaYMIgsgqRfCxoVmrL2IjGtQS9hlt8qTpE5Tn2mwz_EGdR8m0VWHGsHTTeGzIpHSY2n5pWX4Rqyg4axdYUobgcqCmdFPw6EzWeJI" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Robert Doe</span>
                      <span className="text-[10px] text-slate-500">1958 - 2020</span>
                    </div>
                  </div>
               </div>

               {/* Mother */}
               <div className="flex flex-col items-center relative group cursor-pointer hover:scale-105 transition-transform">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-md border border-slate-100 w-56">
                    <div className="size-10 rounded-full overflow-hidden bg-slate-200">
                      <img alt="Mother" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzjoM42cOUKC4AdtPe1NTvvwNS0FCOrpvAR71EmOiRYfqY74dtzS0lJ4kXZg7OZ7iYDYsZLPxnXNOj5Y4RfFOreCSInTlHcALIstrDY29Fp9j7-39y_KIqiB5ifLrMUWuIFMTTd_mlll-Sgp3ilRfOhTMVQ7GWyA-yAd2MhXL0JSW1W4SPYtuBwYvds7vArmZskwhh2DmYXGbEhPvjkknV-sCvj444K8O3Z7BSepK5HR5YmjBUxHzEAA2CmoEe5oeZ35pOxgr9wqw" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Jane Smith</span>
                      <span className="text-[10px] text-slate-500">1960 - Present</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Level 2: Grandparents */}
          <div className="relative flex flex-col items-center">
            <div className="flex gap-4">
              {/* Paternal Side */}
              <div className="flex flex-col items-center relative">
                 <div className="absolute top-1/2 -translate-y-1/2 w-[240px] left-[5%] h-0.5 bg-slate-200 -z-10"></div>
                 <div className="flex gap-4">
                    {/* GP 1 */}
                    <div className="relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-slate-100 w-44">
                        <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center">
                           <span className="material-symbols-outlined text-xs text-primary">person</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs font-semibold truncate">Arthur Doe</span>
                           <span className="text-[9px] text-slate-500">1925 - 1998</span>
                        </div>
                      </div>
                    </div>
                    {/* GP 2 */}
                    <div className="relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-slate-100 w-44">
                        <div className="size-8 rounded-full bg-pink-100 flex items-center justify-center">
                           <span className="material-symbols-outlined text-xs text-pink-500">person</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs font-semibold truncate">Martha Hall</span>
                           <span className="text-[9px] text-slate-500">1930 - 2005</span>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>

               {/* Maternal Side */}
               <div className="flex flex-col items-center relative">
                  <div className="absolute top-1/2 -translate-y-1/2 w-[240px] right-[5%] h-0.5 bg-slate-200 -z-10"></div>
                  <div className="flex gap-4">
                     {/* GP 3 */}
                     <div className="relative">
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                       <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-slate-100 w-44">
                         <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-xs text-primary">person</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs font-semibold truncate">George Smith</span>
                            <span className="text-[9px] text-slate-500">1932 - 2012</span>
                         </div>
                       </div>
                     </div>
                     {/* GP 4 */}
                     <div className="relative">
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200"></div>
                       <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm border border-slate-100 w-44">
                         <div className="size-8 rounded-full bg-pink-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-xs text-pink-500">person</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs font-semibold truncate">Alice Brown</span>
                            <span className="text-[9px] text-slate-500">1935 - 2018</span>
                         </div>
                       </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Level 3: Great Grandparents */}
          <div className="flex gap-2">
            <div className="grid grid-cols-8 gap-1">
               <div className="flex flex-col items-center">
                 <div className="size-12 rounded bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-200">
                   <span className="material-symbols-outlined text-slate-400 text-sm">add</span>
                 </div>
               </div>
               {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="size-12 rounded bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                      <span className="material-symbols-outlined text-slate-300">person</span>
                    </div>
                  </div>
               ))}
            </div>
          </div>

        </div>
      </main>

      {/* Zoom Controls */}
      <div className="fixed right-4 bottom-28 flex flex-col gap-2 z-10">
        <button className="size-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-200 hover:bg-gray-50 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-slate-600">add</span>
        </button>
        <button className="size-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-200 hover:bg-gray-50 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-slate-600">remove</span>
        </button>
      </div>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 inset-x-0 p-4 bg-white/60 backdrop-blur-xl border-t border-slate-200 pb-8 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-900 py-3 rounded-xl font-semibold transition-transform active:scale-95 hover:bg-slate-200">
            <span className="material-symbols-outlined">tune</span>
            Filter
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold shadow-lg shadow-primary/25 transition-transform active:scale-95 hover:bg-blue-600">
            <span className="material-symbols-outlined">my_location</span>
            Focus
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PedigreeChart;