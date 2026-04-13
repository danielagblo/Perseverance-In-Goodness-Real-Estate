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
          className="w-full h-full object-cover opacity-30 scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-[#FDFBF7]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-full lg:max-w-7xl"
        >
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="inline-block mb-8 text-[10px] md:text-xs font-bold uppercase text-white/60"
          >
            Perseverance in Goodness
          </motion.span>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold text-white leading-tight mb-8 md:mb-12 tracking-tight md:whitespace-nowrap">
            Bespoke <br className="sm:hidden" />
            <span className="italic font-light text-(--accent)">Estates.</span>
          </h1>
          
          <p className="text-white/90 text-sm md:text-lg max-w-lg mb-12 leading-relaxed font-medium tracking-wide drop-shadow-sm">
            Discover a digital portfolio of the most exclusive residences in the region. 
            Designed for the relentless pursuit of perfection.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-6 sm:gap-8">
            <motion.a 
              href="#listings" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white text-black text-[10px] sm:text-xs font-black tracking-[0.2em] rounded-none hover:bg-(--accent) hover:text-white transition-all duration-300 shadow-2xl text-center"
            >
              EXPLORE ADVERTISEMENTS
            </motion.a>
            <motion.a 
              href="#about"
              whileHover={{ x: 10 }}
              className="group flex items-center justify-center text-white text-[10px] sm:text-xs font-bold tracking-[0.2em] gap-4"
            >
              ABOUT
              <div className="w-12 h-px bg-white/30 group-hover:w-20 group-hover:bg-(--accent) transition-all duration-500 hidden sm:block"></div>
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Decorative vertical line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: "100px" }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px bg-linear-to-b from-transparent to-[#C0392B]"
      ></motion.div>
    </section>
  );
}
