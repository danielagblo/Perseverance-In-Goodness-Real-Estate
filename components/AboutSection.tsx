"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="py-24 bg-white overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="/about-bg.png" 
                alt="Architecture Detail" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#FDFBF7] rounded-3xl -z-10 border border-[#E9E1D1]"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col space-y-8"
          >
            <div>
              <span className="text-xs font-bold tracking-[0.4em] text-[#C0392B] uppercase mb-4 block">
                Our Heritage
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-[#2C3E50] leading-tight">
                An Unwavering <br />
                <span className="italic font-light text-[#D4AF37]">Legacy of Quality.</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-[#5D6D7E] leading-loose">
              <p>
                At Perseverance in Goodness, we believe that real estate is more than just property—it is the foundation of a life well-lived. Founded on the principles of integrity and meticulous attention to detail, we have curated a portfolio that represents the pinnacle of luxury.
              </p>
              <p>
                Our team of dedicated professionals works tirelessly to ensure that every listing we represent meets our exacting standards. From architectural masterpieces to secluded beachfront retreats, we connect the most discerning clients with their perfect sanctuary.
              </p>
            </div>

            <div className="pt-8">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <div className="text-4xl font-black text-[#2C3E50]">15+</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#7F8C8D] mt-2">Years of Excellence</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-[#2C3E50]">$2B+</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#7F8C8D] mt-2">Properties Sold</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
