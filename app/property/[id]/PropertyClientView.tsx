"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bed, Bath, Maximize, MapPin, ChevronLeft, ChevronRight, X, Calendar, Info, Phone } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Link from "next/link";
import { IProperty } from "@/models/Property";

interface PropertyClientViewProps {
  property: IProperty;
}

export default function PropertyClientView({ property }: PropertyClientViewProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#FDFBF7]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full h-[100dvh] bg-[#FDFBF7] overflow-hidden flex flex-col md:flex-row"
      >
        <Link
          href="/"
          className="absolute top-6 right-6 z-50 p-2 text-(--foreground) hover:opacity-50 transition-all font-light"
          aria-label="Close and return home"
        >
          <X className="w-8 h-8 md:w-10 md:h-10 text-[var(--foreground)] drop-shadow-md" strokeWidth={1} />
        </Link>

        {/* Media Gallery Section */}
        <div className="w-full md:w-1/2 relative bg-[#F1EFE9] h-1/2 md:h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMediaIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
            >
              {activeMedia?.type === "video" ? (
                <video src={activeMedia.url} controls className="w-full h-full object-contain" autoPlay />
              ) : (
                <TransformWrapper initialScale={1}>
                  <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full flex items-center justify-center">
                    <img
                      src={activeMedia?.url}
                      className="max-w-full max-h-[100dvh] object-contain cursor-grab active:cursor-grabbing"
                      alt="Gallery"
                    />
                  </TransformComponent>
                </TransformWrapper>
              )}
            </motion.div>
          </AnimatePresence>

          {media.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 mix-blend-difference text-white hover:opacity-50 transition-opacity"
              >
                <ChevronLeft className="w-8 h-8" strokeWidth={1} />
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 mix-blend-difference text-white hover:opacity-50 transition-opacity"
              >
                <ChevronRight className="w-8 h-8" strokeWidth={1} />
              </button>
            </>
          )}
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-10 md:p-16 overflow-y-auto bg-[#FDFBF7] flex flex-col border-l border-(--border)/20">
          <div className="mb-10">
            <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-2 xl:gap-4 mb-4">
              {property.title && (
                <h2 className="text-2xl md:text-3xl font-black text-(--foreground) tracking-tight uppercase leading-tight max-w-[85%] break-words">
                  {property.title}
                </h2>
              )}
              {property.price && (
                <span className="text-xl md:text-2xl font-black text-(--accent) shrink-0">{property.price}</span>
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
            <h4 className="text-[10px] font-bold text-(--muted) tracking-[0.2em] uppercase">Description</h4>
            <p className="text-(--foreground) leading-relaxed text-sm/8 font-light">
              {property.description ||
                "Inquire for full architectural details and exclusive features of this premier residence."}
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <a
              href={`https://wa.me/233244214684?text=${encodeURIComponent(
                `Hi, I'm interested in ${property.title || "this property"}. Can I get more information?`
              )}`}
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
  );
}
