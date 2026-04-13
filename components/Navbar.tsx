"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass py-4 shadow-md" : "bg-transparent py-8"}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black tracking-tighter text-[#2C3E50]">
          BRIC<span className="text-[#C0392B]">SKY</span>
        </Link>
        <div className="hidden md:flex items-center space-x-12 font-semibold text-sm">
          <Link href="#listings" className="text-[#2C3E50] hover:text-[#C0392B] transition-colors">PROPERTIES</Link>
          <Link href="#" className="text-[#2C3E50] hover:text-[#C0392B] transition-colors">ABOUT</Link>
          <Link href="/admin" className="px-6 py-2 border-2 border-[#2C3E50] rounded-full hover:bg-[#2C3E50] hover:text-white transition-all">PORTAL</Link>
        </div>
      </div>
    </nav>
  );
}
