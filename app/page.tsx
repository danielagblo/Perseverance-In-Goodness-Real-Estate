import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import PropertyGrid from "@/components/PropertyGrid";
import Footer from "@/components/Footer";

export default async function Home() {
  await dbConnect();
  const properties = await Property.find({}).sort({ createdAt: -1 }).lean();

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutSection />
      <div className="max-w-7xl mx-auto px-6 py-24" id="listings">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C3E50] mb-4">Featured Estimates</h2>
          <p className="text-[#7F8C8D] text-lg max-w-2xl mx-auto">
            Discover a curated collection of premier real estate opportunities tailored for the discerning buyer.
          </p>
        </div>
        <PropertyGrid properties={JSON.parse(JSON.stringify(properties))} />
      </div>
      <Footer />
    </main>
  );
}
