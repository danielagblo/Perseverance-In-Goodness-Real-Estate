"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bed, Bath, Maximize, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { IProperty } from "@/models/Property";

interface PropertyCardProps {
  property: IProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const media = property.media || [];
  const activeMedia = media[currentMediaIndex];

  const nextMedia = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <Link href={`/property/${property._id}`}>
      <motion.div 
        whileHover={{ y: -10 }}
        className="luxury-card group h-full flex flex-col"
      >
      <div className="relative h-72 w-full overflow-hidden bg-gray-200">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMediaIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            {activeMedia ? (
              activeMedia.type === 'video' ? (
                <video 
                  src={activeMedia.url} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  muted 
                  loop 
                  onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                  onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                />
              ) : (
                <img 
                  src={activeMedia.url} 
                  alt={property.title || "Property"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Media Available
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Media Controls */}
        {media.length > 1 && (
          <>
            <button 
              onClick={prevMedia}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextMedia}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 right-4 flex gap-1 z-20">
              {media.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentMediaIndex ? "bg-(--accent) w-4" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-(--foreground) text-xs font-bold rounded-full shadow-sm">
            NEW LISTING
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
            {property.title && (
              <h3 className="text-xl font-bold text-(--foreground) group-hover:text-(--accent) transition-colors line-clamp-1">
                {property.title}
              </h3>
            )}
            {property.location && (
              <div className="flex items-center text-[#7F8C8D] text-sm">
                <MapPin className="w-3 h-3 mr-1" />
                {property.location}
              </div>
            )}
          </div>
          {property.price && (
            <span className="text-xl font-black text-(--foreground)">
              {property.price}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center border-t border-(--border) pt-4">
          {property.specs?.beds && property.specs.beds > 0 && (
            <div className="flex flex-col items-center">
              <div className="flex items-center text-(--foreground) font-bold">
                <Bed className="w-4 h-4 mr-1 text-(--accent)" />
                {property.specs.beds}
              </div>
              <span className="text-[10px] text-(--muted) uppercase tracking-wider font-semibold">Beds</span>
            </div>
          )}
          {property.specs?.baths && property.specs.baths > 0 && (
            <div className={`flex flex-col items-center ${property.specs?.beds ? "border-l border-(--border) pr-4 ml-4" : ""}`}>
              <div className="flex items-center text-(--foreground) font-bold">
                <Bath className="w-4 h-4 mr-1 text-(--accent)" />
                {property.specs.baths}
              </div>
              <span className="text-[10px] text-(--muted) uppercase tracking-wider font-semibold">Baths</span>
            </div>
          )}
          {property.specs?.area && (
            <div className={`flex flex-col items-center ${property.specs?.baths || property.specs?.beds ? "border-l border-(--border) pr-4 ml-4" : ""}`}>
              <div className="flex items-center text-(--foreground) font-bold">
                <Maximize className="w-4 h-4 mr-1 text-(--accent)" />
                {property.specs.area}
              </div>
              <span className="text-[10px] text-(--muted) uppercase tracking-wider font-semibold">Sq Ft</span>
            </div>
          )}
          {(!property.specs?.beds && !property.specs?.baths && !property.specs?.area) && (
            <div className="flex items-center text-(--muted) text-xs italic py-1">
              Premium listing details protected.
            </div>
          )}
        </div>
      </div>
    </motion.div>
    </Link>
  );
}
