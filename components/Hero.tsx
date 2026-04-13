"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-bg.png" 
          alt="Luxury Penthouse"
          className="w-full h-full object-cover opacity-60 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#FDFBF7]"></div>
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="inline-block mb-8 text-[10px] md:text-xs font-bold uppercase text-white/60"
          >
            Perseverance in Goodness
          </motion.span>
          
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-extrabold text-white leading-[0.9] mb-12 tracking-tight">
            Curated <br />
            <span className="italic font-light text-[#D4AF37] block mt-2">Excellence.</span>
          </h1>
          
          <p className="text-white/50 text-base md:text-lg max-w-lg mx-auto mb-12 leading-relaxed font-medium tracking-wide">
            Discover a digital portfolio of the most exclusive residences in the region. 
            Designed for the relentless pursuit of perfection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <motion.a 
              href="#listings" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white text-black text-xs font-black tracking-[0.2em] rounded-none hover:bg-[#D4AF37] hover:text-white transition-all duration-300 shadow-2xl"
            >
              EXPLORE ADVERTISEMENTS
            </motion.a>
            <motion.button 
              whileHover={{ x: 10 }}
              className="group flex items-center text-white text-xs font-bold tracking-[0.2em] gap-4"
            >
              OUR PHILOSOPHY
              <div className="w-12 h-[1px] bg-white/30 group-hover:w-20 group-hover:bg-[#D4AF37] transition-all duration-500"></div>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Decorative vertical line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: "100px" }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent to-[#C0392B]"
      ></motion.div>
    </section>
  );
}
