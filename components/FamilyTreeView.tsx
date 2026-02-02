import React from 'react';
import BottomNav from './BottomNav';

interface Props {
  onNavigate: (screen: string) => void;
}

const FamilyTreeView: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen flex flex-col overflow-hidden relative">
      {/* Top App Bar */}
      <div className="flex items-center bg-background-light p-4 pb-2 justify-between z-20 shadow-sm border-b border-slate-100">
        <div className="text-[#0d121b] flex size-12 shrink-0 items-center justify-start cursor-pointer hover:bg-gray-100 rounded-full pl-2 transition-colors">
          <span className="material-symbols-outlined">search</span>
        </div>
        <h2 className="text-[#0d121b] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Family Tree</h2>
        <div className="flex w-12 items-center justify-end">
          <button 
            onClick={() => onNavigate('Settings')}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-gray-100 text-[#0d121b] hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <main className="flex-1 relative overflow-auto bg-[#f8f9fc] flex items-center justify-center p-8 pb-32">
        {/* Connecting Lines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none">
          <path d="M 50% 120 L 50% 200 M 20% 200 L 80% 200 M 20% 200 L 20% 280 M 80% 200 L 80% 280 M 50% 450 L 50% 530" fill="none" stroke="#cbd5e1" strokeWidth="2"></path>
        </svg>

        <div className="relative flex flex-col items-center gap-16 w-full max-w-4xl pt-10">
          {/* Gen 1: Grandparents */}
          <div className="flex gap-8 md:gap-24 relative z-10">
            <div 
              className="flex flex-col items-center gap-2 group cursor-pointer"
              onClick={() => onNavigate('Biography')}
            >
              <div className="w-20 h-20 rounded-full bg-white shadow-lg border-2 border-slate-100 p-1 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2PtVEad10c4J_EkwJM1WJ_uYtyc7TBDmYXRnsKuVjk76HzMImPw1TCwV6DVFl26wsuLCnstE1XqzK-ezgNh_25Wka-8V6FmxTG1ghHhmniuIoJ8MgaRUIBnHjjW282nXt51AKUWZCNSl9sBUL_dOsx-GoHdtWCo23yqqiepBtz2hF7DPyaIzTNGO4MkTjiK5_CaXhrAJNLR1_-vJqQZjVmHluRDtzdpeR2xiMIXceCl3qHpoDL_FhUqURfw0GB2JLaFw_d9hWXUQ')" }}></div>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold">Arthur Miller</p>
                <p className="text-[10px] text-slate-500">1942 - 2018</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-white shadow-lg border-2 border-slate-100 p-1 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBYQ9zBjBE3o8GZuWfWY1WJFdV0qgzgtH5Ss1N657FiWjTC0dppL0rh5UL1_R9wGoOS4TTKMC73gw--rNbOIzJUHXWFEZvpKFNj6_NEr5blhME9bM_HqyOglpLh265ew4dIR50JMiZuBIfETfGKXjAfEyxcYOSYRQgRMapYZLXjRbz0m-lTvRJXPw8WMlac7OePd48Au1DDcOqwnNZgV2f1Nuo1nhzJTvX_5WYUDi9RPwjMChZxMZ5M02K33vSLweBpfYdiQaTxIK8')" }}></div>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold">Martha Miller</p>
                <p className="text-[10px] text-slate-500">1945 - Present</p>
              </div>
            </div>
          </div>

          {/* Gen 2: Parents (Focus) */}
          <div className="flex gap-8 md:gap-32 relative z-10">
            <div 
              className="flex flex-col items-center gap-2 group cursor-pointer"
              onClick={() => onNavigate('Settings')} // Demo link
            >
              <div className="w-24 h-24 rounded-full bg-white shadow-xl border-4 border-primary p-1 relative group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfIXFnyKnt2UGZo2ElfLGK885ff3Nawwj0p2BPq6h0DOiJ7Hf3oW4aJ7elFCiamafDIyEI5n3BfvjA2GQwJcVw4yHj0sZ3_xyZsj6jiOHKJX5VawHEUd0sIeiDl4q-0wh_dihFhUKXK5CcpPv5AKP1skdpnWMhtWL0pNFYxBcYuxtVeMj2yddsD6l1EOBR_TkUQpmoTtQ3cjU_04O79mMqtRM_LSG80FMUgzRm47q7I3iCUGgCYOiRuXkljIqGmDw6YDernDnDusY')" }}></div>
                <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 border-2 border-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs">star</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">James Miller</p>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-primary">Me (User)</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-white shadow-xl border-2 border-slate-100 p-1 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOwnhK1qJmLmsDMW8AL5mDJ2l2QsT71jBBqNrAjaaoNDUdN94s2CdIFS3LKrh8PChBh1oQoG81I_UYWJXpOpDSB-tk13tmLvvZTQoAs4jcUMRL4bQzV4cM0pGqf46yAXXJ-VRcCQn5RTctXRi3e0g8Ej_mC27EgIr9g0RaSl3TXT7Lu3mNIFKZrzBgPOem16D3vteL9KhCQJQ0jopS6SZ5nNNQ1atvli7dB6q5DVrbZ045BiGuQq1MSUcoG2U6k_FuPm4pS5tlr2A')" }}></div>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">Sarah Miller</p>
                <p className="text-[10px] text-slate-500">Wife</p>
              </div>
            </div>
          </div>

          {/* Gen 3: Children */}
          <div className="flex gap-12 relative z-10">
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-white shadow-md border-2 border-slate-100 p-1 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD6ZyUwud9QLtXIsG-RapCsh1zrZz0wbjwHZHjit2X9tg-Q_yuNY2K9sSiX3-irUgsOQJNLKHUYt4ebo0IP_B3n9DCKVEoUxuI69mAhvbTIZ-d8R3te2aka3QhKIhiX278Lf6UrGyJCPM6vq8Dr3j6xnD1f6BObbwIYkTO96BC1IdYooW6jIXOt2SyZGhlemOkvB53cV-qZA3Ydu7WWyjIRwAlKV1jBil-6SnfKDCc5i9dEv9aTKOYwyrQsN5GkriAPAYPYxWHvJAI')" }}></div>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold">Robert Miller</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-white shadow-md border-2 border-slate-100 p-1 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAF0DVjVCmjlHj4Vs0Ije6fUQQLd1U8B3n0thkuiAxd7Wi3wldxT4jmnUAwduSENkH1mXnIxBe-tg0zPF0KWEAXggxBgmA7ICvNpu7LfxBGk0o88400tleJyg8oFj7G0Gz-_OvMxF72wSclULR0pRvtRnTdD0suxCp9SoEuY3i--bYCF77lLLkzA5nI0RRHImLApCn7lVkZmHOFlPnh7460vF2O8JsjWhS6xACDoFdZYGeUcPNyDB1vLUvgILYDJHS-ZMECHq30zTU')" }}></div>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold">Alice Miller</p>
              </div>
            </div>
            {/* Add Child */}
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <button className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-white group-hover:border-primary group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined">add</span>
              </button>
              <div className="text-center">
                <p className="text-[11px] text-slate-400 italic group-hover:text-primary transition-colors">Add Child</p>
              </div>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-10">
          <button className="p-2 bg-white shadow-lg rounded-lg text-slate-600 hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined">zoom_in</span>
          </button>
          <button className="p-2 bg-white shadow-lg rounded-lg text-slate-600 hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined">zoom_out</span>
          </button>
          <button className="p-2 bg-white shadow-lg rounded-lg text-primary hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>
      </main>

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-30">
        <button className="flex items-center justify-center rounded-full w-14 h-14 bg-primary text-white shadow-xl hover:scale-105 transition-transform hover:shadow-2xl hover:shadow-primary/30">
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      </div>

      <BottomNav current="Tree" onNavigate={onNavigate} />
    </div>
  );
};

export default FamilyTreeView;