"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
      {/* Background Image/Video placeholder - normally you'd use a high-res asset */}
      <div className="absolute inset-0 z-0 opacity-40">
        <video 
          autoPlay 
          muted 
          loop 
          className="w-full h-full object-cover"
          src="https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-buildings-at-dusk-1250-large.mp4"
        />
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-[0.3em] uppercase border border-white/30 text-white rounded-full">
            Luxury Real Estate Showcase
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8">
            Elevating Your <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F9E29C]">
              Living Experience
            </span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Perseverance in Goodness presents a curated portfolio of the world's most prestigious residences. 
            Exquisite design, unmatched locations, and timeless elegance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#listings" className="luxury-button bg-white text-[#1A1A1A] hover:bg-[#D4AF37] hover:text-white border-none">
              VIEW LISTINGS
            </a>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-[#1A1A1A] transition-all">
              CONTACT US
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
