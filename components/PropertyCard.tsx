"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bed, Bath, Maximize, MapPin, ChevronLeft, ChevronRight, X, Calendar, Info, Phone } from "lucide-react";
import { IProperty } from "@/models/Property";

interface PropertyCardProps {
  property: IProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const media = property.media || [];
  const activeMedia = media[currentMediaIndex];

  const nextMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentMediaIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -10 }}
        onClick={() => setIsModalOpen(true)}
        className="luxury-card group h-full flex flex-col cursor-pointer"
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

      {/* Detail Modal / Lightbox */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full h-[100dvh] bg-[#FDFBF7] rounded-none overflow-hidden flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 z-50 p-2 text-(--foreground) hover:opacity-50 transition-all font-light"
              >
                <X className="w-8 h-8 md:w-10 md:h-10 text-[var(--foreground)] drop-shadow-md" strokeWidth={1} />
              </button>

              {/* Media Gallery Section */}
              <div className="w-full md:w-1/2 relative bg-[#F1EFE9] h-1/2 md:h-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMediaIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                  >
                    {activeMedia?.type === 'video' ? (
                      <video src={activeMedia.url} controls className="w-full h-full object-cover" autoPlay />
                    ) : (
                      <img src={activeMedia?.url} className="w-full h-full object-cover" alt="Gallery" />
                    )}
                  </motion.div>
                </AnimatePresence>

                {media.length > 1 && (
                  <>
                    <button onClick={prevMedia} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 mix-blend-difference text-white hover:opacity-50 transition-opacity">
                      <ChevronLeft className="w-8 h-8" strokeWidth={1} />
                    </button>
                    <button onClick={nextMedia} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 mix-blend-difference text-white hover:opacity-50 transition-opacity">
                      <ChevronRight className="w-8 h-8" strokeWidth={1} />
                    </button>
                  </>
                )}
              </div>

              {/* Info Section */}
              <div className="w-full md:w-1/2 p-10 md:p-16 overflow-y-auto bg-[#FDFBF7] flex flex-col border-l border-(--border)/20">
                <div className="mb-10">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    {property.title && (
                      <h2 className="text-3xl md:text-5xl font-black text-(--foreground) tracking-tighter uppercase leading-[1.1]">
                        {property.title}
                      </h2>
                    )}
                    {property.price && (
                      <span className="text-2xl font-black text-(--accent) shrink-0">{property.price}</span>
                    )}
                  </div>
                  <div className="flex items-center text-(--muted) font-bold text-sm tracking-widest uppercase">
                    <MapPin className="w-4 h-4 mr-2 text-(--accent)" />
                    {property.location}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12 pb-10 border-b border-(--border)/20">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-(--muted) uppercase tracking-widest">Beds</p>
                    <p className="font-light text-2xl text-(--foreground)">{property.specs?.beds || "--"}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-(--muted) uppercase tracking-widest">Baths</p>
                    <p className="font-light text-2xl text-(--foreground)">{property.specs?.baths || "--"}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-(--muted) uppercase tracking-widest">Area</p>
                    <p className="font-light text-2xl text-(--foreground)">{property.specs?.area || "--"}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-(--muted) uppercase tracking-widest">Status</p>
                    <p className="font-light text-2xl text-(--foreground)">Available</p>
                  </div>
                </div>

                <div className="space-y-4 mb-12 flex-grow">
                  <h4 className="text-[10px] font-bold text-(--muted) tracking-[0.2em] uppercase">
                    Description
                  </h4>
                  <p className="text-(--foreground) leading-relaxed text-sm/8 font-light">
                    {property.description || "Inquire for full architectural details and exclusive features of this premier residence."}
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <a
                    href={`https://wa.me/233208613040?text=${encodeURIComponent(`Hi, I'm interested in ${property.title || "this property"}. Can I get more information?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 border-[1px] border-(--foreground) bg-(--foreground) text-[#FDFBF7] font-bold tracking-[0.2em] uppercase text-xs text-center hover:bg-transparent hover:text-(--foreground) transition-all"
                  >
                    INQUIRE NOW
                  </a>
                  <a
                    href="tel:+233240328282"
                    className="w-full py-4 bg-transparent text-(--foreground) font-bold tracking-[0.1em] text-center text-xs opacity-60 hover:opacity-100 transition-opacity"
                  >
                    +233 240 328 282
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
