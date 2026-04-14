"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useRef } from "react";

export default function PerfumeSection({ perfumes }: { perfumes: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -140, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 140, behavior: "smooth" });
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
          className="flex gap-4 md:gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {perfumes.map((perfume) => (
            <motion.div 
              key={perfume._id}
              whileHover={{ y: -10 }}
              className="w-[120px] md:w-[160px] min-w-[120px] md:min-w-[160px] bg-transparent rounded-none snap-start flex-shrink-0 flex flex-col group cursor-pointer"
            >
              <div className="aspect-square rounded-none overflow-hidden mb-3 bg-transparent flex items-center justify-center relative border border-(--border)/30">
                {perfume.media && perfume.media[0] ? (
                   <img src={perfume.media[0].url} alt={perfume.title} className="w-full h-full object-contain p-2 transition-transform duration-700 hover:scale-105" />
                ) : (
                  <ShoppingBag className="w-8 h-8 text-gray-300" />
                )}
                {perfume.price && (
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm">
                    {perfume.price}
                  </div>
                )}
              </div>
              {perfume.title && (
                <h3 className="font-black text-sm md:text-base text-(--foreground) mb-1 line-clamp-1">{perfume.title}</h3>
              )}
              {perfume.description && (
                <p className="text-(--muted) text-[9px] md:text-[10px] font-medium line-clamp-2 leading-relaxed mb-3 flex-grow">
                  {perfume.description}
                </p>
              )}
              <a 
                href={`https://wa.me/233208613040?text=${encodeURIComponent(`Hi, I'm interested in purchasing the ${perfume.title || "featured"} perfume.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 border-[1px] border-(--foreground) text-(--foreground) hover:bg-(--accent) hover:border-(--accent) hover:text-white rounded-lg font-bold tracking-widest text-[8px] md:text-[9px] text-center transition-all mt-auto flex items-center justify-center gap-1.5 uppercase"
              >
                <ShoppingBag className="w-3 h-3" /> Order
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
