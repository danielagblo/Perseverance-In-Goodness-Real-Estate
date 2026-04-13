"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? "bg-white/80 backdrop-blur-lg py-4 shadow-sm" : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link 
          href="/" 
          className={`text-2xl font-black tracking-[0.2em] transition-colors duration-500 ${
            isScrolled ? "text-[#2C3E50]" : "text-white"
          }`}
        >
          PERSEVERANCE
        </Link>
        
        <div className={`hidden md:flex items-center space-x-12 text-xs font-bold tracking-[0.3em] transition-colors duration-500 ${
          isScrolled ? "text-[#2C3E50]" : "text-white/80"
        }`}>
          <Link href="#listings" className="hover:text-[#C0392B] transition-colors">PROPERTIES</Link>
          <Link href="#about" className="hover:text-[#C0392B] transition-colors">ABOUT</Link>
        </div>

        <div className="md:hidden">
          {/* Mobile menu toggle could go here */}
          <div className={`w-6 h-0.5 mb-1.5 transition-colors ${isScrolled ? "bg-[#2C3E50]" : "bg-white"}`}></div>
          <div className={`w-6 h-0.5 transition-colors ${isScrolled ? "bg-[#2C3E50]" : "bg-white"}`}></div>
        </div>
      </div>
    </nav>
  );
}
