export default function Footer() {
  return (
    <footer className="bg-(--foreground) text-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase">
              PERSEVERANCE IN GOODNESS
            </h2>
            <p className="text-white/50 max-w-sm leading-relaxed text-lg italic">
              "Redefining luxury real estate through an unwavering commitment to excellence and integrity."
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-xs uppercase tracking-[0.3em] text-white/30">Navigation</h4>
            <ul className="space-y-4 text-sm font-bold tracking-widest">
              <li><a href="#listings" className="hover:text-(--accent) transition-colors">PROPERTIES</a></li>
              <li><a href="#about" className="hover:text-(--accent) transition-colors">OUR MISSION</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-xs uppercase tracking-[0.3em] text-white/30">Connect</h4>
            <ul className="space-y-4 text-sm font-medium text-white/50 tracking-wide">
              <li>OFFICE@PERSEVERANCE.COM</li>
              <li>+233 (0) 555 123 456</li>
              <li>ACCRA, GHANA</li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/20 font-bold tracking-[0.2em] uppercase">
          <p>© 2025 PERSEVERANCE IN GOODNESS. ALL RIGHTS RESERVED.</p>
          <div className="mt-6 md:mt-0 flex gap-2 items-center">
            <span>PROUDLY CRAFTED BY</span>
            <a href="https://skytechghana.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-(--accent) transition-colors border-b border-white/10 pb-0.5">
              SKYTECH GHANA
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
