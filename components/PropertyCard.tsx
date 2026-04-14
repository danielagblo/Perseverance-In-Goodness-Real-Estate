"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import Link from "next/link";
import { IProperty } from "@/models/Property";

interface PropertyCardProps {
  property: IProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const media = property.media || [];
  const activeMedia = media[currentMediaIndex];

  return (
    <Link href={`/property/${property._id}`} className="block h-full cursor-pointer focus:outline-none">
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

          {/* Media Indicators */}
          {media.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-1 z-20">
              {media.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentMediaIndex ? "bg-(--accent) w-4" : "bg-white/50"}`}
                />
              ))}
            </div>
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
            {property.specs?.beds && (
              <div className="flex items-center text-(--foreground) font-bold text-sm">
                <Bed className="w-4 h-4 mr-2 text-(--accent)" /> {property.specs.beds}
              </div>
            )}
            {property.specs?.baths && (
              <div className="flex items-center text-(--foreground) font-bold text-sm">
                <Bath className="w-4 h-4 mr-2 text-(--accent)" /> {property.specs.baths}
              </div>
            )}
            {property.specs?.area && (
              <div className="flex items-center text-(--foreground) font-bold text-sm">
                <Maximize className="w-4 h-4 mr-2 text-(--accent)" /> {property.specs.area}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
