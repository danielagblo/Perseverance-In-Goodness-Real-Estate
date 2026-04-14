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
              <h3 className="text-xl font-bold text-(--foreground) group-hover:text-(--accent) transition-colors line-clamp-1">
                {property.title || "Luxury Property"}
              </h3>
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
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white md:text-(--foreground) md:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Media Gallery Section */}
              <div className="w-full md:w-3/5 relative bg-transparent h-1/2 md:h-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMediaIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                  >
                    {activeMedia?.type === 'video' ? (
                      <video src={activeMedia.url} controls className="w-full h-full object-contain" autoPlay />
                    ) : (
                      <img src={activeMedia?.url} className="w-full h-full object-contain" alt="Gallery" />
                    )}
                  </motion.div>
                </AnimatePresence>

                {media.length > 1 && (
                  <>
                    <button onClick={prevMedia} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white hover:bg-gray-100 text-(--foreground) rounded-full shadow-lg transition-all">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextMedia} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white hover:bg-gray-100 text-(--foreground) rounded-full shadow-lg transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Info Section */}
              <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
                <div className="mb-8">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h2 className="text-3xl md:text-4xl font-black text-(--foreground) tracking-tight uppercase leading-tight">
                      {property.title}
                    </h2>
                    {property.price && (
                      <span className="text-2xl font-black text-(--accent) shrink-0">{property.price}</span>
                    )}
                  </div>
                  <div className="flex items-center text-(--muted) font-bold text-sm tracking-widest uppercase">
                    <MapPin className="w-4 h-4 mr-2 text-(--accent)" />
                    {property.location}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10 pb-8 border-b border-(--border)">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-50 rounded-2xl"><Bed className="w-5 h-5 text-(--accent)" /></div>
                    <div><p className="text-[10px] font-bold text-(--muted) uppercase tracking-wider">Beds</p><p className="font-black text-(--foreground)">{property.specs?.beds || "--"}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-50 rounded-2xl"><Bath className="w-5 h-5 text-(--accent)" /></div>
                    <div><p className="text-[10px] font-bold text-(--muted) uppercase tracking-wider">Baths</p><p className="font-black text-(--foreground)">{property.specs?.baths || "--"}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-50 rounded-2xl"><Maximize className="w-5 h-5 text-(--accent)" /></div>
                    <div><p className="text-[10px] font-bold text-(--muted) uppercase tracking-wider">Area</p><p className="font-black text-(--foreground)">{property.specs?.area || "--"}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-50 rounded-2xl"><Calendar className="w-5 h-5 text-(--accent)" /></div>
                    <div><p className="text-[10px] font-bold text-(--muted) uppercase tracking-wider">Status</p><p className="font-black text-(--foreground)">Available</p></div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="text-sm font-black text-(--foreground) tracking-widest uppercase flex items-center gap-2">
                    <Info className="w-4 h-4 text-(--accent)" /> Description
                  </h4>
                  <p className="text-(--muted) leading-relaxed text-base italic">
                    {property.description || "Inquire for full architectural details and exclusive features of this premier residence."}
                  </p>
                </div>

                <div className="mt-auto flex flex-col sm:flex-row gap-4">
                  <a
                    href="tel:+233240328282"
                    className="flex-1 py-5 bg-white border-2 border-(--foreground) text-(--foreground) font-black tracking-[0.1em] rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    +233 240 328 282
                  </a>
                  <a
                    href={`https://wa.me/233208613040?text=${encodeURIComponent(`Hi, I'm interested in ${property.title}. Can I get more information?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-[2] py-5 bg-(--foreground) text-white font-black tracking-[0.2em] rounded-2xl hover:bg-(--foreground)/90 transition-all shadow-xl shadow-(--foreground)/20 text-center block"
                  >
                    INQUIRE NOW
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
