"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 ${
          isScrolled ? "bg-white/80 backdrop-blur-lg py-4 shadow-sm" : "bg-white/5 backdrop-blur-[2px] py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 transition-all duration-300 group">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className={`transition-all duration-500 ${
                isScrolled ? "h-10" : "h-16 brightness-110 contrast-125 saturate-110 drop-shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
              } w-auto`}
            />
            <div className="flex flex-col">
              <span className={`transition-all duration-500 leading-tight ${
                isScrolled ? "text-[10px] font-black tracking-[0.3em] text-(--foreground)" : "text-[12px] font-black tracking-[0.4em] text-white"
              }`}>
                PERSEVERANCE IN GOODNESS
              </span>
              <span className={`transition-all duration-500 uppercase opacity-60 ${
                isScrolled ? "text-[7px] font-bold tracking-[0.4em] text-(--foreground)" : "text-[9px] font-black tracking-[0.5em] text-white"
              }`}>
                Real Estate
              </span>
            </div>
          </Link>
          
          <div className={`hidden md:flex items-center space-x-12 text-xs font-bold tracking-[0.3em] transition-colors duration-500 ${
            isScrolled ? "text-[#2C3E50]" : "text-white/80"
          }`}>
            <Link href="#listings" className="hover:text-(--accent) transition-colors">PROPERTIES</Link>
            <Link href="#about" className="hover:text-(--accent) transition-colors">ABOUT</Link>
          </div>

          <button 
            className="md:hidden flex flex-col gap-1.5 focus:outline-none z-[130]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <motion.div 
              animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className={`w-6 h-0.5 transition-colors ${
                isMobileMenuOpen || isScrolled ? "bg-(--foreground)" : "bg-white"
              }`}
            />
            <motion.div 
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className={`w-6 h-0.5 transition-colors ${
                isScrolled ? "bg-(--foreground)" : "bg-white"
              }`}
            />
            <motion.div 
              animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className={`w-6 h-0.5 transition-colors ${
                isMobileMenuOpen || isScrolled ? "bg-(--foreground)" : "bg-white"
              }`}
            />
          </button>
        </div>
        
        {/* Mobile Menu Dropdown - Moved inside nav for stacking context */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-6 right-6 z-[120] md:hidden bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-(--border) p-6 w-64 flex flex-col space-y-5"
            >
              <Link 
                href="#listings" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-black tracking-[0.3em] text-(--foreground) hover:text-(--accent) transition-colors"
              >
                PROPERTIES
              </Link>
              <Link 
                href="#about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-black tracking-[0.3em] text-(--foreground) hover:text-(--accent) transition-colors"
              >
                ABOUT
              </Link>
              <div className="pt-4 border-t border-(--border)">
                <p className="text-(--muted) text-[8px] font-bold tracking-[0.5em] uppercase">
                  EST. 2025
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
