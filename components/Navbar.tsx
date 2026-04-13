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
          isScrolled ? "bg-white/80 backdrop-blur-lg py-4 shadow-sm" : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="transition-all duration-300 transform hover:scale-105">
            <img 
              src="/logo.png" 
              alt="Perseverance in Goodness" 
              className="h-12 w-auto transition-all duration-500"
            />
          </Link>
          
          <div className={`hidden md:flex items-center space-x-12 text-xs font-bold tracking-[0.3em] transition-colors duration-500 ${
            isScrolled ? "text-[#2C3E50]" : "text-white/80"
          }`}>
            <Link href="#listings" className="hover:text-(--accent) transition-colors">PROPERTIES</Link>
            <Link href="#about" className="hover:text-(--accent) transition-colors">ABOUT</Link>
          </div>

          <button 
            className="md:hidden flex flex-col gap-1.5 focus:outline-none z-100"
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
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-20 right-6 z-90 md:hidden bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-(--border) p-5 w-56 flex flex-col space-y-4"
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
    </>
  );
}
