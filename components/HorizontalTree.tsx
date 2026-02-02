import React from 'react';

interface Props {
  onNavigate: (screen: string) => void;
}

const HorizontalTree: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-background-light font-display text-[#0d121b] antialiased overflow-hidden min-h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center bg-white/80 backdrop-blur-md p-4 border-b border-gray-200 justify-between">
        <div className="flex items-center gap-3">
           <div 
             onClick={() => onNavigate('Discover')}
             className="text-[#0d121b] cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
           >
              <span className="material-symbols-outlined">arrow_back</span>
           </div>
           <div>
              <h2 className="text-[#0d121b] text-lg font-bold leading-tight tracking-[-0.015em]">Ancestry Tree View</h2>
              <p className="text-xs text-gray-500">Miller-Doe Family Lineage</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-gray-100 p-1 rounded-lg mr-2">
              <button className="px-3 py-1 text-xs font-semibold bg-white shadow-sm rounded-md transition-all">Ancestors</button>
              <button className="px-3 py-1 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">Descendants</button>
           </div>
           <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-gray-600">search</span>
           </button>
           <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm hover:bg-blue-600 transition-colors">
              <span className="material-symbols-outlined">share</span>
           </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="fixed top-[73px] left-0 right-0 z-40 bg-white/50 backdrop-blur-sm border-b border-gray-100">
         <div className="flex gap-3 p-3 overflow-x-auto no-scrollbar">
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 border border-primary/20 pl-4 pr-3 hover:bg-primary/20 transition-colors">
               <p className="text-primary text-sm font-medium leading-normal">Direct Lineage</p>
               <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-gray-200 pl-4 pr-3 hover:bg-gray-50 transition-colors">
               <p className="text-[#0d121b] text-sm font-medium leading-normal">Paternal</p>
               <span className="material-symbols-outlined text-gray-400 text-[18px]">keyboard_arrow_down</span>
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-gray-200 pl-4 pr-3 hover:bg-gray-50 transition-colors">
               <p className="text-[#0d121b] text-sm font-medium leading-normal">Maternal</p>
               <span className="material-symbols-outlined text-gray-400 text-[18px]">keyboard_arrow_down</span>
            </button>
         </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-screen overflow-auto custom-scrollbar pt-32 bg-[#f8f9fc]">
         <div className="min-w-[2000px] h-[800px] p-20 relative">
            
            {/* Gen 1 (Great Grandparents) */}
            <div className="absolute left-20 top-1/2 -translate-y-1/2 flex flex-col gap-40">
               <div className="flex flex-col gap-4 relative">
                  {/* Node 1 */}
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 w-64 z-10 group cursor-pointer hover:border-primary/50 transition-colors">
                     <div className="h-12 w-12 rounded-full bg-center bg-cover border-2 border-primary/30" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDYMj3Mc3YpKJIa7Eq5k4q6z5sObDcOlmsi-h2XMCKtzolLn-C4GGKL6eXlC8y2Zy8QtA0_baGdsMv1o3lH1CvY_WsMfeOw7Zn6PsvLpQ3DJRZOciS-b14drKHtdePkOUogRMLhtouKhV6on1exMp1k6EpYPz7QJwfqvK-nTEYYG5QRxVhSIDUoN7ic-Xmtz6lzHp7lBUgXVEMMZ79atZTysBhk-3phVCGzxfJsJoqRZhpe1zXtNpXFFZ5OyqEOyZibKVY0DG6IKdI')"}}></div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-[#0d121b]">Arthur Miller</p>
                        <p className="text-[11px] text-primary font-medium">1865 — 1942</p>
                     </div>
                     <span className="material-symbols-outlined text-gray-400 text-lg opacity-0 group-hover:opacity-100 transition-opacity">more_vert</span>
                  </div>
                  {/* Connector */}
                  <div className="absolute w-16 h-[2px] bg-[#cbd5e1] left-64 top-[50%]"></div>
                  
                  {/* Node 2 */}
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 w-64 z-10 group cursor-pointer hover:border-primary/50 transition-colors">
                     <div className="h-12 w-12 rounded-full bg-center bg-cover border-2 border-pink-200" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCNBrFmIge8Nt3PTmYoaC-M4tvFqOxk4uciGSE0hP7sEPLkej-VNKOM11QPJRealOVwoaeCL_1PTvEYaloCDgV3zLqPGNOMfIFSQH3alq79AW2mX48k6AzyBOkPrcE8aY16_CoJlMH_qxIrjgS3t5NuehE0ikhe98FlBOFV97fcsfRjl43J9kVjrsIturjH48HUhq0gvEW2LgR8G-tIVacVg6WloeRwQhRshHVv5iYDL6FlWCdlveUyvB8R5aQvxejscj1_brskW84')"}}></div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-[#0d121b]">Eleanor Rigby</p>
                        <p className="text-[11px] text-primary font-medium">1870 — 1950</p>
                     </div>
                     <span className="material-symbols-outlined text-gray-400 text-lg opacity-0 group-hover:opacity-100 transition-opacity">more_vert</span>
                  </div>
               </div>
            </div>

            {/* Vertical Connector Col 1-2 */}
            <div className="absolute w-[2px] h-[320px] bg-[#cbd5e1] left-[344px] top-[240px]"></div>

            {/* Gen 2 (Grandparents) */}
            <div className="absolute left-[440px] top-1/2 -translate-y-1/2 flex flex-col gap-60">
               <div className="flex flex-col gap-4 relative">
                  {/* Node GP1 */}
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-2 border-primary/40 w-64 z-10 group cursor-pointer hover:border-primary transition-colors">
                     <div className="h-12 w-12 rounded-full bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDML71mG4-gDbFvXzToqB_kIV1Ebxbv_ftACP5JvaNDLr3imh1MH17J2ScDXdc1NGmZay5ulShPLrQCEHuNmR08XgGTCcWGueVBPbqXSXqFb3mkBe8L8alm2L_Wl0sL3oUkJno9GZEe6Son5TaeeJVQXNukDgD8Mmy9Uj3vEpQsldBBcPn258T2Q1MHcs8mcFJvcPz1epnKO__LvIOI5w_YgLQuGgCgtEYeCYgtwDL1sk8w3-q7VEs_smyPR6YU_JWpXX-VzkiKsss')"}}></div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-[#0d121b]">Jonathan Doe</p>
                        <p className="text-[11px] text-primary font-medium">1892 — 1965</p>
                     </div>
                     <button className="bg-primary/10 text-primary rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                     </button>
                  </div>
                  {/* Connectors */}
                  <div className="absolute w-24 h-[2px] bg-primary -left-24 top-[50%]"></div>
                  <div className="absolute w-16 h-[2px] bg-primary left-64 top-[50%]"></div>
                  
                  {/* Node GP2 */}
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 w-64 z-10 group cursor-pointer hover:border-primary/50 transition-colors">
                     <div className="h-12 w-12 rounded-full bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmrV8S9-GzQzoEue7g-kDLjZIuIxOCdpijyFpQ7HKwNONJHXr-tdRBHOdV5rvAqUWXG76JLdDoE1J9dBZxvWtkADhSkjr4siccB1sh9EXfC50Tr8TLR73pj1SiVDVdg_fxvaC5UieWNzjUMzIQtgH1gKvITJYONWLq4JepKKiBHR3Y3E29g6mxpRkYre9s9Lqkhsg7pexuHskodUWNPoFjCVxw7vQha3A_uDDISWyK1UnBvlU8jISexpc2pHawQ5ZaGIqwgmivhbo')"}}></div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-[#0d121b]">Sarah Miller-Doe</p>
                        <p className="text-[11px] text-primary font-medium">1895 — 1970</p>
                     </div>
                     <span className="material-symbols-outlined text-gray-400 text-lg opacity-0 group-hover:opacity-100 transition-opacity">more_vert</span>
                  </div>
               </div>
            </div>

            {/* Vertical Connector Col 2-3 */}
            <div className="absolute w-[2px] h-[100px] bg-primary left-[760px] top-[350px]"></div>

            {/* Gen 3 (Parents) */}
            <div className="absolute left-[840px] top-1/2 -translate-y-1/2">
               <div className="flex flex-col gap-4 relative">
                  {/* Node P1 */}
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-[0_4px_20px_rgba(19,91,236,0.1)] border-2 border-primary w-64 z-10 cursor-pointer hover:shadow-xl transition-shadow">
                     <div className="h-12 w-12 rounded-full bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC9EoHsIGj51m-XxCBsXHB7Z0Wc7YwsdJ5Hkt8Mu8W-TyerhaGdiN567_vHyHtULwyST3qJ8WM6A3q8ynS0PVhTI4D0j5I6dIJkfHRLLs0LCPShJZwG-Wk7BuFAmizhf9fLZTQqX4WAzQlgt5vTRVUj-t_LdRXaS4T44mtD_V3BJRjpXWC5bawFPxoxkbUAzZY3o4vyaDo7EkHVNGYqIURLZwkhdwn0u6hvdlQXunveqlFEYJXoW-Yp8fzjplABm7iPechqcv4uxjo')"}}></div>
                     <div className="flex-1">
                        <div className="flex items-center gap-1">
                           <p className="text-sm font-bold text-[#0d121b]">Robert Doe</p>
                           <span className="material-symbols-outlined text-primary text-[14px]">stars</span>
                        </div>
                        <p className="text-[11px] text-primary font-medium">1920 — 1998</p>
                     </div>
                     <span className="material-symbols-outlined text-primary text-lg">info</span>
                  </div>
                  {/* Connectors */}
                  <div className="absolute w-24 h-[2px] bg-primary -left-24 top-[50%]"></div>
                  <div className="absolute w-16 h-[2px] bg-primary left-64 top-[50%]"></div>
                  
                  {/* Node P2 */}
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 w-64 z-10 cursor-pointer hover:border-primary/50 transition-colors">
                     <div className="h-12 w-12 rounded-full bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAnLxb2R1V99BPxRiKNf0UuSJC89mdNOqhF0qMwmAkC7HiOEXXiYOLrgCKEM_JgYcufCixRfI9ZP63lSllvNbra8M3PteumyLIlmp9gQ7L0UBpVl5wY2ifSQbooJFhjAystv5fHCZ5NxooSLAAfxnEfKLIp4Pw8EAMJ9wcDNk7XI21Pi9tJ-jw1U6nel5EI6JyuCEclAkj4XsExbsjx4_jyX9beMG3p9BnqYBBMjjSme6xbAu2YnLlw1S5SkWoYkJ0cHG4weoUeTR0')"}}></div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-[#0d121b]">Mary Swanson</p>
                        <p className="text-[11px] text-primary font-medium">1924 — 2005</p>
                     </div>
                     <span className="material-symbols-outlined text-gray-400 text-lg opacity-0 hover:opacity-100 transition-opacity">more_vert</span>
                  </div>
               </div>
            </div>

            {/* Gen 4 (Children) */}
            <div className="absolute left-[1240px] top-1/2 -translate-y-1/2 flex flex-col gap-8">
               <div className="flex items-center gap-4 group">
                  <div className="absolute w-12 h-[2px] bg-primary -left-12 top-[50%]"></div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 w-64 z-10 cursor-pointer hover:border-primary transition-colors">
                     <div className="h-12 w-12 rounded-full bg-center bg-cover" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqS3AL2z3AtjYzIgMaDcj4pTczSvy7wJffCcUsMh0-B98Y3UrCo5_vVSYmpWAfOpgR7i5MDMBCJLn8zrh0RO9gfyapDuzalDpxs3hC8N5s8bXXdeqrWCgdb5kXS2slKNGo9uO_C1xWafN5sgTQcMqKqtcyEiKNwqPpHclEOwM2obykd7-9wEhCuXwc77nLMUKIxRkqssSlzJCsBWxZhKfyuFSjaHvm8TNIF2Yn_sjMyg1W4WxCItGUXE4XDK4g56awB7nTUnx2syw')"}}></div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-[#0d121b]">Michael Doe (You)</p>
                        <p className="text-[11px] text-primary font-medium">1955 — Present</p>
                     </div>
                  </div>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 border border-dashed border-gray-400 text-gray-400 hover:border-primary hover:text-primary transition-all">
                     <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
               </div>
               
               <div className="flex items-center gap-4">
                  <div className="absolute w-12 h-[2px] bg-[#cbd5e1] -left-12 top-[50%]"></div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 w-64 z-10 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                     <div className="h-12 w-12 rounded-full bg-center bg-cover grayscale" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3HbLwr_yLVN_i-Uoh1qwcCL0R16o-t69UEPcDomCZ596kjyQ7Z9ySpjaxD2y1dyHzByQGpuSbYrPYYlreRXgbsHf4wIyLNcuPDmgKeU9kRknVbeoolOf7G8_9P9Xr-jZSyp7VvB4yPS6xkCfO85oUMSio0WmsvmCF8M36x5j3uV7535-6T7VvhoLnc4GtLQM74vGr_d7Cjw31yCSv6_1LIsnWTF7eEeIKbcAU61Lvfkstdgtvfv3hQnhJn62jcdeXrErwnglN5UE')"}}></div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-[#0d121b]">Linda Doe</p>
                        <p className="text-[11px] text-primary font-medium">1958 — 2012</p>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>

      {/* Mini-Map */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
         <div className="w-32 h-20 bg-white/90 backdrop-blur rounded-lg border border-gray-200 shadow-xl p-1 overflow-hidden relative group cursor-pointer hover:border-primary transition-colors">
            <div className="w-full h-full bg-gray-50 rounded-sm relative">
               <div className="absolute w-2 h-2 bg-primary rounded-full left-4 top-8 opacity-40"></div>
               <div className="absolute w-2 h-2 bg-primary rounded-full left-12 top-8 opacity-60"></div>
               <div className="absolute w-2 h-2 bg-primary rounded-full left-20 top-6"></div>
               <div className="absolute w-2 h-2 bg-primary rounded-full left-20 top-10 opacity-60"></div>
               <div className="absolute inset-0 border-2 border-primary/50 m-2 rounded-sm pointer-events-none"></div>
            </div>
            <div className="absolute bottom-1 right-1">
               <span className="material-symbols-outlined text-[12px] text-gray-400">zoom_out_map</span>
            </div>
         </div>
         {/* Controls */}
         <div className="flex flex-col gap-2 bg-white p-1.5 rounded-2xl shadow-2xl border border-gray-100">
            <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-700 transition-colors">
               <span className="material-symbols-outlined">add</span>
            </button>
            <div className="h-[1px] mx-2 bg-gray-100"></div>
            <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-700 transition-colors">
               <span className="material-symbols-outlined">remove</span>
            </button>
            <div className="h-[1px] mx-2 bg-gray-100"></div>
            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors">
               <span className="material-symbols-outlined">center_focus_weak</span>
            </button>
         </div>
      </div>
      
      {/* Context Tooltip */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
         <div className="h-14 w-14 rounded-full bg-center bg-cover border-2 border-primary" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTn72Sm4GFq_K5kU7FysrEIkA9TJasVgZJ5EpBKv3nrjCu4Wk9j0iUI7p-K5_O-83A45S1OIRMNx9sjGVo4SIf3U4HuqTm2NkXLfxXT8jj76IKbUQj-yOb3MCoQmvGE06I8pplNFSpSwr_BKfuR7nt8AaPmhcjvL_LVHOUooshCnY3uKlyVp_vvNE9nPwlJDw8CDbZ8NeAK4lUXFexfSvS-AosoiccXIRP2OeAo7T7Ifi07ZSskFpub-oTdKnxY95U68aduB1oRJI')"}}></div>
         <div className="flex-1">
            <h4 className="font-bold text-gray-900">Robert Doe</h4>
            <p className="text-sm text-gray-500">Father • 1920-1998 • 4 Records</p>
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors">Profile</button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
               <span className="material-symbols-outlined text-[20px] text-gray-600">more_horiz</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default HorizontalTree;