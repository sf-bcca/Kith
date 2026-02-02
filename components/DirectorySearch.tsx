import React from 'react';

interface DirectorySearchProps {
  onSearch: (query: string) => void;
  onBack?: () => void;
}

const DirectorySearch: React.FC<DirectorySearchProps> = ({ onSearch, onBack }) => {
  return (
    <div className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center p-4 pb-2 justify-between">
         <div 
           className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
           onClick={onBack}
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
            <input 
              className="w-full border-none bg-transparent focus:ring-0 text-sm placeholder:text-slate-500 outline-none px-2" 
              type="text" 
              placeholder="Search family members..." 
              onChange={(e) => onSearch(e.target.value)}
            />
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
  );
};

export default DirectorySearch;
