import { getProperty } from "@/lib/property-actions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MediaGallery from "@/components/MediaGallery";
import { Bed, Bath, Maximize, MapPin, Share2, Heart, Calendar } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const p = await getProperty(params.id);

  if (!p) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Media & Description */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-(--foreground) mb-2">{p.title || "Luxury Listing"}</h1>
                  <div className="flex items-center text-(--muted)">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span className="text-lg">{p.location || "Location available upon request"}</span>
                  </div>
                </div>
                <div className="hidden md:flex gap-4">
                  <button className="p-3 rounded-full border border-(--border) hover:bg-white transition-all">
                    <Share2 className="w-5 h-5 text-(--foreground)" />
                  </button>
                  <button className="p-3 rounded-full border border-(--border) hover:bg-white transition-all">
                    <Heart className="w-5 h-5 text-(--foreground)" />
                  </button>
                </div>
              </div>

              <MediaGallery media={p.media} />
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl border border-(--border)">
              <h3 className="text-2xl font-bold text-(--foreground) mb-6">About this Property</h3>
              <p className="text-(--muted) leading-loose text-lg whitespace-pre-wrap">
                {p.description || "No description provided for this exclusive property."}
              </p>
            </div>
          </div>

          {/* Right Column: Key Details & CTA */}
          <div className="space-y-8">
            <div className="bg-(--foreground) text-white p-8 rounded-3xl shadow-2xl sticky top-32">
              <div className="mb-8">
                <span className="text-white/60 text-sm font-bold uppercase tracking-widest">Price</span>
                <div className="text-4xl font-black mt-1">{p.price || "Contact for Price"}</div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10 pb-8 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center text-white/60 text-xs font-bold uppercase">
                    <Bed className="w-4 h-4 mr-2" /> Bedrooms
                  </div>
                  <div className="text-xl font-bold">{p.specs?.beds || "--"}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-white/60 text-xs font-bold uppercase">
                    <Bath className="w-4 h-4 mr-2" /> Bathrooms
                  </div>
                  <div className="text-xl font-bold">{p.specs?.baths || "--"}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-white/60 text-xs font-bold uppercase">
                    <Maximize className="w-4 h-4 mr-2" /> Square Feet
                  </div>
                  <div className="text-xl font-bold">{p.specs?.area || "--"}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-white/60 text-xs font-bold uppercase">
                    <Calendar className="w-4 h-4 mr-2" /> Year Built
                  </div>
                  <div className="text-xl font-bold">{p.specs?.yearBuilt || "Recent"}</div>
                </div>
              </div>

              <button className="w-full py-5 bg-(--accent) hover:bg-(--accent)/90 text-(--foreground) font-black rounded-2xl transition-all shadow-lg mb-4">
                REQUEST INFORMATION
              </button>
              <button className="w-full py-5 border-2 border-white/20 hover:border-white text-white font-bold rounded-2xl transition-all">
                SCHEDULE A TOUR
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
