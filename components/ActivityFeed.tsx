import React from 'react';
import BottomNav from './BottomNav';

interface Props {
  onNavigate: (screen: string) => void;
}

const ActivityFeed: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-background-light shadow-xl overflow-x-hidden border-x border-gray-100">
        {/* Top App Bar */}
        <header className="sticky top-0 z-10 flex items-center bg-background-light/95 backdrop-blur-md px-4 py-3 justify-between border-b border-slate-200">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-slate-700">notifications</span>
          </div>
          <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">Memories & Feed</h1>
          <div className="flex size-10 items-center justify-end">
            <button className="flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors p-2">
              <span className="material-symbols-outlined text-slate-700">search</span>
            </button>
          </div>
        </header>

        {/* Tabs */}
        <nav className="bg-background-light sticky top-[60px] z-10">
          <div className="flex border-b border-slate-200 px-4 gap-6">
            <button className="flex flex-col items-center justify-center border-b-[3px] border-primary text-primary pb-3 pt-4 px-2">
              <p className="text-sm font-bold tracking-tight">All Updates</p>
            </button>
            <button className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 hover:text-slate-700 pb-3 pt-4 px-2 transition-colors">
              <p className="text-sm font-bold tracking-tight">Photos</p>
            </button>
            <button className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-slate-500 hover:text-slate-700 pb-3 pt-4 px-2 transition-colors">
              <p className="text-sm font-bold tracking-tight">Profile</p>
            </button>
          </div>
        </nav>

        {/* Main Feed */}
        <main className="flex-1 overflow-y-auto space-y-4 py-4 px-4 pb-32">
          {/* Card 1: Photos */}
          <section className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-slate-900 leading-tight">
                    <span className="font-bold">Uncle John</span> added <span className="font-bold">3 photos</span> to <span className="text-primary font-semibold cursor-pointer hover:underline">Grandma Rose</span>
                  </p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuC43cinnWvwtZx1KdZEhJGqUEYE72rWAb7RhU_VbRuK7MGGQIwnZhvGn9aXCBpAumUUxifrWXkWwgxSV3CitTyWYY4gF6Vxaw8WpGkC9CTAJmlFh3_b4aCTWhnE7p5SdRfJOQiuNHoLiyOMyymedIIW6cUy-M9C8NApKOx-um73lhfj_-Yg4humKR_0qf4VgougudW_ECVtoepxHyUctHixk5nHvZru69TjVpRMjAaW-yLOnQ-X0d18Ax3kJMokq-yVtEoeqm3xCqw',
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDGNBaHFJGzsy2nIoxULp5YqfyaqswUfj2Bm1dVOGbPaeJClQWQe_M3mdsH9bsI7WeeUjbRvo0aI8CLTwuuLlX7EeQP-1MnKSix_74dJWZyM8AL0pfCduNic5-h9ekEpswlHdzFa2k0rlCbHd6YWzkJ_yDG8tiEso70WkeoPrrQkWvaBwIrd5CF6ulz5NPn2A0upp6f7QgSETaOWA5O83H-svV1gY8IExfBxYgNGIjd2eWVKzsYvEfyN9qj7u9pgNrvf0AJ2FaWP7M',
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBPCpLDzYEoa5r89b1RVBLGKZ0Aw_4w8NzrW-YG4rx3b-DE3M9W1NFAAU5gXwTgGlFq6ca_oczWuWAa0cq8oFClDF8KI6B-eeB_PmxhAYoeHSh3CJPocO8qY2JHoAmq5y9nsGzldE31ULjMV1-7oP295A9PyngBLq6WxuheWlCeAVWHl0RpeX8VRiJ_9GKa99RHysBHuPplV_EyDUW7VWaeLHsWhPJ5-TKwRLlCHd_NGw5PDkwgdR_zSQSGs404lajFhBZtiS3yYq4'
                ].map((url, i) => (
                  <div key={i} className="aspect-square bg-slate-200 rounded-lg bg-cover bg-center cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundImage: `url('${url}')` }}></div>
                ))}
              </div>
              <p className="text-sm text-slate-600 italic">"Found these in the attic today! Heritage collection from 1950s."</p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
                <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                  Comment
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-blue-600 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  Approve
                </button>
              </div>
            </div>
          </section>

          {/* Card 2: Update */}
          <section className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                  <span className="material-symbols-outlined">person_pin</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-slate-900 leading-tight">
                    <span className="font-bold">Sarah</span> updated the <span className="font-bold">birth date</span> for <span className="text-primary font-semibold cursor-pointer hover:underline">Leo Smith</span>
                  </p>
                  <p className="text-xs text-slate-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 bg-slate-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Old</p>
                  <p className="text-slate-400 line-through text-sm">May 12, 1942</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                <div className="text-center">
                  <p className="text-[10px] uppercase text-primary font-bold mb-1">New</p>
                  <p className="text-slate-900 font-bold text-sm">May 12, 1944</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
                <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                  Comment
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-blue-600 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  Approve
                </button>
              </div>
            </div>
          </section>

          {/* Card 3: New Member */}
          <section className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <span className="material-symbols-outlined">family_history</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-slate-900 leading-tight">
                    <span className="font-bold">Michael</span> added <span className="font-bold">Baby Clara</span> to the family tree
                  </p>
                  <p className="text-xs text-slate-500">Yesterday at 4:30 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100/50">
                <div className="size-16 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuALlfWxJS82QzrLp81MZhx4K9EJVOZLP5UtI0DlOHHsFHMy0F2OdWqZ_DwfSAS6wVzfBtqp8ssLInOV8bV1pRVYvnvsFnWYu_TLVzeJeMFQ995esDz3BmeasBNE5FnydCr3Y-lzvxfWCBMl_MKWftVs87_1ZaZgYbUmp-O6hyvbF72v5DhLYTQf86wv8k5adBMKra1a2pAB9c2idIQL_WtPJNPsdr4JFL-CW7ZRNgw1HqHgDCybbWVxEqeS3its_RKeT4v3PWfF_sM')" }}></div>
                <div>
                  <p className="font-bold text-slate-900">Clara Jane Thompson</p>
                  <p className="text-xs text-slate-500">Born: June 15, 2024</p>
                  <p className="text-xs text-slate-500 italic mt-1">Daughter of Michael & Elena</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
                <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                  Comment
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-blue-600 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  Approve
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* FAB */}
        <button className="fixed bottom-24 right-6 size-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform hover:shadow-primary/30 z-20">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>

        <BottomNav current="Memories" onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default ActivityFeed;