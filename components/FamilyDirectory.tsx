import React from 'react';
import BottomNav from './BottomNav';

interface Props {
  onNavigate: (screen: string) => void;
}

const FamilyDirectory: React.FC<Props> = ({ onNavigate }) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  return (
    <div className="bg-background-light font-display text-slate-900 antialiased min-h-screen flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center p-4 pb-2 justify-between">
           <div 
             className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
             onClick={() => onNavigate('Discover')}
           >
              <span className="material-symbols-outlined text-slate-600">arrow_back_ios</span>
              <h2 className="text-xl font-bold leading-tight tracking-tight">Family Directory</h2>
           </div>
           <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-200 transition-colors">
              <span className="material-symbols-outlined text-primary">person_add</span>
           </button>
        </div>
        
        {/* Search */}
        <div className="px-4 py-2">
          <label className="flex flex-col w-full">
            <div className="flex w-full items-stretch rounded-xl h-10 bg-slate-200/60 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20">
              <div className="flex items-center justify-center pl-3">
                 <span className="material-symbols-outlined text-slate-500 text-[20px]">search</span>
              </div>
              <input className="w-full border-none bg-transparent focus:ring-0 text-sm placeholder:text-slate-500 outline-none px-2" type="text" placeholder="Search family members..." />
              <div className="flex items-center justify-center pr-3">
                 <span className="material-symbols-outlined text-slate-500 text-[20px]">mic</span>
              </div>
            </div>
          </label>
        </div>

        {/* Filters */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-1 rounded-full bg-primary px-4 hover:bg-blue-600 transition-colors">
             <p className="text-white text-xs font-semibold">Living</p>
             <span className="material-symbols-outlined text-white text-[16px]">expand_more</span>
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-1 rounded-full bg-slate-200 px-4 hover:bg-slate-300 transition-colors">
             <p className="text-slate-700 text-xs font-semibold">Deceased</p>
             <span className="material-symbols-outlined text-slate-500 text-[16px]">expand_more</span>
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-1 rounded-full bg-slate-200 px-4 hover:bg-slate-300 transition-colors">
             <p className="text-slate-700 text-xs font-semibold">By Branch</p>
             <span className="material-symbols-outlined text-slate-500 text-[16px]">expand_more</span>
          </button>
        </div>
      </div>

      {/* Alphabet Sidebar */}
      <div className="fixed right-1 top-40 z-40 flex flex-col gap-0.5 text-[10px] font-bold text-primary px-1 py-4 h-[calc(100vh-200px)] overflow-y-auto no-scrollbar">
         {alphabet.map(letter => (
           <span key={letter} className="cursor-pointer hover:scale-125 transition-transform">{letter}</span>
         ))}
      </div>

      {/* Content */}
      <main className="pb-20 flex-1">
        {/* Section A */}
        <div className="sticky top-[156px] z-30 bg-background-light px-4 py-1">
           <h3 className="text-primary text-sm font-bold">A</h3>
        </div>
        <div className="divide-y divide-slate-100">
           {/* Item 1 */}
           <div className="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                 <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border border-slate-200 group-hover:border-primary transition-colors" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvMBmXeWe_rNCy5y-q8evJNRYPuDO2Df01-KwLTb64xNKPiizgqYpO0d6cG7lTK-fUC-qjV93sGEkpTxcSLCV96-WlQuH_BrhJCHMoYNW1Lt6udzux9u7PbnkLyy1uVFVpv3TGSfrlzBPrl9VRoTO_cQK6GtAsHdrTNf8sxCTidZ7IdD-0c5eDiGu8lLQgIsYHXWbr6mOvlDgkRSjBWmLhPe7Qg6Lk66DwumO4Sn0th95uqD5T_Tae-EdCzsGwXwXSkLNRAQ06XXY")'}}></div>
                 <div className="flex flex-col">
                    <p className="text-slate-900 text-sm font-semibold leading-snug">Arthur J. Sterling</p>
                    <p className="text-slate-500 text-xs font-normal">1920–1995</p>
                 </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                 <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Great Grandfather</span>
                 <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-500 text-[18px]">chevron_right</span>
              </div>
           </div>
           {/* Item 2 */}
           <div className="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                 <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border border-slate-200 group-hover:border-primary transition-colors" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-UZBqN-2wUqP95_aY2cks-vC99i8T3uBTmHlnub196DwUNoy2VxwS0DTSY4_01zm_2AKdGuYlym6AUYMAwJ9Gqm_Mtdbr8PXI5FdFeqe2dxvpTsbz3_uIUM8nOVEdAie8Zi5z3m3SV52HhedHf7OCxhcPpvIVj8R3RF6xHC160MH_PlOKKv74B7LUQ-eikClOvE0ykVaRMrz9iOlnduwBfM7JZUsr5EA3u0E5gn0f9I7N-QZawc-GjakGV-clrrXKqd_lKwLO6Ic")'}}></div>
                 <div className="flex flex-col">
                    <p className="text-slate-900 text-sm font-semibold leading-snug">Alice Montgomery</p>
                    <p className="text-slate-500 text-xs font-normal">1952–Present</p>
                 </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                 <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">Aunt</span>
                 <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-500 text-[18px]">chevron_right</span>
              </div>
           </div>
        </div>

        {/* Section B */}
        <div className="sticky top-[156px] z-30 bg-background-light px-4 py-1 mt-4">
           <h3 className="text-primary text-sm font-bold">B</h3>
        </div>
        <div className="divide-y divide-slate-100">
           <div className="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                 <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border border-slate-200 group-hover:border-primary transition-colors" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA8L3TzhmxW-pkltrNIwgKTBR5IdWQtlr92rNKZlvr_TNgTBPPjp-x0TXCQ7_CIuYG1UEVBHX7BuVuvQi8YpG-mSFfHlmihdf8ANdyP9ygtWuqf-x4r78pFfTlHPPQWt1ZoEF7A1fhmc1wLXDdqHvw7wrEkt_7w4seGcSf66CRMxhM29lxl5fbDpIvjBlmEtMyEzuk2JgeZSkmgwcz0W6Yr8DSqYVr-Ut7cW7_bWgl4KYOy2Ve1dzodkndXlZzoOHO-gdwXc-ZyiU0")'}}></div>
                 <div className="flex flex-col">
                    <p className="text-slate-900 text-sm font-semibold leading-snug">Benjamin Sterling</p>
                    <p className="text-slate-500 text-xs font-normal">1988–Present</p>
                 </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                 <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">Brother</span>
                 <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-500 text-[18px]">chevron_right</span>
              </div>
           </div>
        </div>
      </main>

      <BottomNav current="Discover" onNavigate={onNavigate} />
    </div>
  );
};

export default FamilyDirectory;