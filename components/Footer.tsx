export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-black mb-6 tracking-tighter">
              BRIC<span className="text-[#C0392B]">SKY</span>
            </h2>
            <p className="text-white/50 max-w-sm leading-relaxed">
              Redefining luxury real estate through perseverance in goodness. 
              Our mission is to connect discerning individuals with exclusive 
              living spaces that inspire and elevate.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-white/40">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-[#C0392B] transition-colors">Browse Properties</a></li>
              <li><a href="#" className="hover:text-[#C0392B] transition-colors">Our Approach</a></li>
              <li><a href="/admin" className="hover:text-[#C0392B] transition-colors">Dev Portal</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-white/40">Contact</h4>
            <ul className="space-y-4 text-sm font-medium text-white/50">
              <li>info@bricsky.com</li>
              <li>+233 (0) 555 123 456</li>
              <li>Accra, Ghana</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:row justify-between items-center text-xs text-white/30 font-medium">
          <p>© 2026 BRICSKY REAL ESTATE. ALL RIGHTS RESERVED.</p>
          <p className="mt-4 md:mt-0">DESIGNED BY SKYTECH GHANA</p>
        </div>
      </div>
    </footer>
  );
}
