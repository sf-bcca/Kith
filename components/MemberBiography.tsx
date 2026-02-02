import React from 'react';

interface Props {
  onNavigate: (screen: string) => void;
}

const MemberBiography: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="bg-background-light font-display text-[#0d121b] antialiased overflow-x-hidden min-h-screen">
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 flex items-center bg-background-light/80 backdrop-blur-md p-4 justify-between border-b border-gray-200">
        <button 
          onClick={() => onNavigate('Tree')}
          className="flex items-center justify-center size-10 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[#0d121b]">arrow_back_ios_new</span>
        </button>
        <h2 className="text-sm font-bold leading-tight tracking-tight flex-1 text-center truncate px-2">Eleanor J. Sterling (1892–1974)</h2>
        <div className="flex items-center justify-end">
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-200 transition-colors">
            <span className="material-symbols-outlined text-[#0d121b]">ios_share</span>
          </button>
        </div>
      </nav>

      <main className="max-w-md mx-auto min-h-screen pb-20">
        {/* Hero Section */}
        <section className="relative">
          <div 
            className="w-full h-64 bg-cover bg-center" 
            style={{ 
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLxqqJxgZI-4PUINdKgnVI0_pOUCCWPVPtv3r7w_cZI3qoOUkqSRuvjW1FfZHHjO842qTmhcrUIqMgAWHeHKMWsGGARAelUMcevA9jjHXo0NLc443oUedDtxlKrbl1srJ668vTLUVrzJXT5zE_ATNy9CR_ArDmZXYkpvSIrBTjEVWCr3eCPC4ImltBQt5K-MtFMjEJxH9VXagton-n5BpebGhCBtoUK_EVvu2Y__PZPCS-x4qY-XqjPIZ-9qmmM3-PmZlpIzwvPL8')",
              filter: "sepia(0.6) contrast(1.1) brightness(0.9)"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-light via-transparent to-transparent"></div>
          
          <div className="relative -mt-20 px-4 flex flex-col items-center">
            <div className="size-32 rounded-full border-4 border-background-light overflow-hidden shadow-xl">
              <img 
                alt="Eleanor Sterling" 
                className="w-full h-full object-cover" 
                style={{ filter: "sepia(0.6) contrast(1.1) brightness(0.9)" }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLoiICUqlzvc7Akdt1FVuU-kkhhkaeUwe29GtChw3l1nkJ9XccakAEz0nXEOd047_ONXtt-4OVnp_p5o-IlWoqZ1GvON6IRPZebmWCTJo0Idj45YoUlVbXYOMwP-A8Z6ogvAji2-p5D8ilauIcHWcRZMfwO-1YIqXO5J8YYekcPSKpZ0uINTnS3CFAULJJSft3mEXgEub8UtAtHOjkuPMI0mh_wqdwJjnSPBSrx2FDIczHY4IHMfYpnulAMWvYl8lldiLKi4eIRaU"
              />
            </div>
            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Eleanor J. Sterling</h1>
              <p className="text-primary font-medium text-sm mt-1">1892 — 1974</p>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="material-symbols-outlined text-primary text-sm">family_history</span>
                <span className="text-primary text-xs font-bold uppercase tracking-wider">Great-Grandmother</span>
              </div>
            </div>
          </div>
        </section>

        {/* Life Events Timeline */}
        <section className="mt-8 px-4">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-xl font-bold tracking-tight">Life Events</h2>
            <button className="text-primary text-sm font-semibold hover:underline">View map</button>
          </div>
          
          <div className="grid grid-cols-[40px_1fr] gap-x-3 mt-2">
            {[
              { icon: 'child_care', title: 'Born in Dublin, Ireland', date: 'May 14, 1892 • St. Patrick\'s District', isLast: false },
              { icon: 'directions_boat', title: 'Immigrated to New York', date: 'June 20, 1912 • Ellis Island arrival via SS Oceanic', isLast: false },
              { icon: 'favorite', title: 'Married Arthur Sterling', date: 'September 12, 1920 • St. Jude’s Chapel, Brooklyn', isLast: false },
              { icon: 'church', title: 'Deceased', date: 'November 03, 1974 • Queens, New York', isLast: true },
            ].map((event, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-[22px]">{event.icon}</span>
                  </div>
                  {!event.isLast && <div className="w-[2px] bg-gray-200 h-full grow my-1"></div>}
                </div>
                <div className={`pt-1 ${!event.isLast ? 'pb-8' : ''}`}>
                  <p className="text-base font-bold leading-none">{event.title}</p>
                  <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{event.date}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Media Section */}
        <section className="mt-12 px-4 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Media & Documents</h2>
            <button className="text-primary text-sm font-semibold hover:underline">See all (12)</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {[
               { title: 'Ship Manifest', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZhT0lygaclIYPKsdC0KGWu2zPfeNVJFke5gYZ_HpniFfK7PqfDWSMjZo7xnIqsnmyfLm71VQvtUV1ceCjjTlsl-fqINsGcb4wvXZ9k5jeVhbjA0vnjKMccRG4eMk5qjk2M1Kt0AHp3Guw0trGJiq-lIDo93QAh5A-MD0zVKyFcrHKszSKWbgwS28BfBDqx6-wFSHOxOaKGgG0LwqvTMbf6UimeQ3dzYLPG1f-YKGS993pOLgUaK14nqhpCaksSiLUA53NT7NGv0o' },
               { title: 'Marriage Cert.', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGGgJ3m0AHBzED0adRXglcYLS48SYaC4bfiu3G8fTrmH7Bjsy4PQHcmfPSbB8eYTcP62tLOG7G6XnMALwt0L-ZzohfmUgCApLLps8c6N63Z0OwvgR7zGTzCXrvNzqdFqbHx6ntRnOZoI9EW3Nx2CGjZKIIKvkgCpRcqFRmCFNLa3fc7ZR5tTGUwKasMkbkOhhU9eoVYJX82IFDBYRbfo6jqpMDWDHgyKufQD5NsyZmQpofyO5i6ExXRilCpjwYf4LbxEUQHzomf_s' },
               { title: '1940 Census', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRLZi4DUVIyunIDcb_fO56j4sDnJVeiq3qnhXE9FsiOD44-mWSzetiisXa-N6WbqZxZ261QIGUym8ucLdUoNT-U7v5sntuOwdSxeMgvIXxVS60D6v8zaaUYg6uNOxjyrxw_lLQ_QH3lbWFzSXfgT34Wpnf7e6sHUZlU4dLUqq0PokZmtcD3bJMzzaukNhM3MJgKL06Z2DaQj56-SlOdaI3SkOzgflQwyzdHTY32srTMKrWskkQ7sC4aapZegCdTckow0WbrI7ys4I' }
            ].map((media, i) => (
              <div key={i} className="min-w-[140px] flex flex-col gap-2 group cursor-pointer">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-200 border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow">
                  <img alt={media.title} className="w-full h-full object-cover" style={{ filter: "sepia(0.6) contrast(1.1) brightness(0.9)" }} src={media.url} />
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide group-hover:text-primary transition-colors">{media.title}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Biography Summary */}
        <section className="mt-4 px-4 pb-20">
          <h2 className="text-xl font-bold tracking-tight mb-3">Biography</h2>
          <p className="text-gray-600 text-sm leading-relaxed italic">
              "Eleanor was the cornerstone of our family's arrival in America. She left Dublin at age 20 with nothing but a suitcase and her mother's sewing kit. Her resilience during the depression years defined the Sterling legacy..."
          </p>
          <button className="mt-3 text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Read full story <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light to-transparent">
        <div className="max-w-md mx-auto flex gap-3">
          <button className="flex-1 bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Add Memory
          </button>
          <button className="size-[52px] bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-gray-700">edit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberBiography;