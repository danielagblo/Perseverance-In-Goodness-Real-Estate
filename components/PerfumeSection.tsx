"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useRef } from "react";

export default function PerfumeSection({ perfumes }: { perfumes: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
  };

  if (!perfumes || perfumes.length === 0) return null;

  return (
    <section className="py-24 bg-[#FDFBF7] overflow-hidden" id="perfumes">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <div>
          <span className="text-xs font-bold tracking-[0.4em] text-(--accent) uppercase mb-4 block">
            Other Business
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-(--foreground) leading-tight">
            Our Perfume <span className="italic font-light text-(--accent)">Collection.</span>
          </h2>
        </div>
        <div className="flex gap-4 hidden md:flex">
          <button onClick={scrollLeft} className="p-4 rounded-full border border-(--border) hover:bg-(--accent) hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={scrollRight} className="p-4 rounded-full border border-(--border) hover:bg-(--accent) hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pl-6 pr-6 md:pr-0 relative">
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {perfumes.map((perfume) => (
            <motion.div 
              key={perfume._id}
              whileHover={{ y: -10 }}
              className="min-w-[220px] md:min-w-[260px] bg-transparent rounded-none snap-start flex-shrink-0 flex flex-col group cursor-pointer"
            >
              <div className="aspect-square rounded-none overflow-hidden mb-6 bg-transparent flex items-center justify-center relative border border-(--border)/30">
                {perfume.media && perfume.media[0] ? (
                   <img src={perfume.media[0].url} alt={perfume.title} className="w-full h-full object-contain p-4 transition-transform duration-700 hover:scale-105" />
                ) : (
                  <ShoppingBag className="w-12 h-12 text-gray-300" />
                )}
                {perfume.price && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {perfume.price}
                  </div>
                )}
              </div>
              {perfume.title && (
                <h3 className="font-black text-xl text-(--foreground) mb-2 line-clamp-1">{perfume.title}</h3>
              )}
              {perfume.description && (
                <p className="text-(--muted) text-sm font-medium line-clamp-2 leading-relaxed mb-6 flex-grow">
                  {perfume.description}
                </p>
              )}
              <a 
                href={`https://wa.me/233208613040?text=${encodeURIComponent(`Hi, I'm interested in purchasing the ${perfume.title || "featured"} perfume.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 border-2 border-(--foreground) text-(--foreground) hover:bg-(--accent) hover:border-(--accent) hover:text-white rounded-xl font-bold tracking-widest text-[10px] text-center transition-all mt-auto flex items-center justify-center gap-2 uppercase"
              >
                <ShoppingBag className="w-4 h-4" /> Order Now
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
