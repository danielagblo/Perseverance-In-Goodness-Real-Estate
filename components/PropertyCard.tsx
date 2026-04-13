"use client";

import { motion } from "framer-motion";
import { Bed, Bath, Maximize, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";
import { IProperty } from "@/models/Property";

interface PropertyCardProps {
  property: IProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const mainMedia = property.media?.[0];

  return (
    <Link href={`/property/${property._id}`}>
      <motion.div 
        whileHover={{ y: -10 }}
        className="luxury-card group h-full flex flex-col"
      >
      <div className="relative h-72 w-full overflow-hidden bg-gray-200">
        {mainMedia ? (
          mainMedia.type === 'video' ? (
            <video 
              src={mainMedia.url} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              muted 
              loop 
              onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
              onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
            />
          ) : (
            <img 
              src={mainMedia.url} 
              alt={property.title || "Property"} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#2C3E50] text-xs font-bold rounded-full shadow-sm">
            NEW LISTING
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-[#2C3E50] group-hover:text-[#C0392B] transition-colors line-clamp-1">
              {property.title || "Untitled Property"}
            </h3>
            <div className="flex items-center text-[#7F8C8D] text-sm mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {property.location || "Location TBD"}
            </div>
          </div>
          <span className="text-xl font-black text-[#2C3E50]">
            {property.price || "Contact for Price"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-[#E9E1D1] pt-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-[#2C3E50] font-bold">
              <Bed className="w-4 h-4 mr-1 text-[#C0392B]" />
              {property.specs?.beds || "-"}
            </div>
            <span className="text-[10px] text-[#7F8C8D] uppercase tracking-wider font-semibold">Beds</span>
          </div>
          <div className="flex flex-col items-center border-x border-[#E9E1D1]">
            <div className="flex items-center text-[#2C3E50] font-bold">
              <Bath className="w-4 h-4 mr-1 text-[#C0392B]" />
              {property.specs?.baths || "-"}
            </div>
            <span className="text-[10px] text-[#7F8C8D] uppercase tracking-wider font-semibold">Baths</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center text-[#2C3E50] font-bold">
              <Maximize className="w-4 h-4 mr-1 text-[#C0392B]" />
              {property.specs?.area || "-"}
            </div>
            <span className="text-[10px] text-[#7F8C8D] uppercase tracking-wider font-semibold">Sq Ft</span>
          </div>
        </div>
      </div>
    </motion.div>
    </Link>
  );
}
