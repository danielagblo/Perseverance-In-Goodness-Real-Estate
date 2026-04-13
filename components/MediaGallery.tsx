"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface MediaGalleryProps {
  media: { url: string; type: 'image' | 'video' }[];
}

export default function MediaGallery({ media }: MediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media || media.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % media.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {media[currentIndex].type === 'video' ? (
              <video 
                src={media[currentIndex].url} 
                controls 
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <img 
                src={media[currentIndex].url} 
                alt="Property View" 
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {media.length > 1 && (
          <>
            <button 
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {media.map((item, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative shrink-0 w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
              currentIndex === index ? "border-[#C0392B] scale-105" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            {item.type === 'video' ? (
              <div className="relative w-full h-full">
                <video src={item.url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            ) : (
              <img src={item.url} className="w-full h-full object-cover" alt={`Thumb ${index}`} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
