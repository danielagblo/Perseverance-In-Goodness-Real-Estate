import React from 'react';

export default function MapSection() {
  return (
    <section className="w-full h-[500px] relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 z-0 grayscale-[20%] brightness-[95%] hover:grayscale-0 transition-all duration-700">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://maps.google.com/maps?q=Perseverance%20In%20Goodness%20Accra&t=&z=17&ie=UTF8&iwloc=&output=embed"
        ></iframe>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 pointer-events-none flex items-end md:items-center justify-center md:justify-start p-6 md:p-20">
          <div className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl max-w-[260px] md:max-w-[280px] shadow-2xl border border-white/20 pointer-events-auto transform transition-all hover:scale-[1.02] duration-500">
          <div className="space-y-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-(--muted) uppercase tracking-[0.2em]">Address</span>
              <p className="text-base font-bold text-(--foreground) leading-tight uppercase tracking-tight">
                Perseverance In Goodness
              </p>
              <p className="text-[10px] font-bold text-(--muted) uppercase tracking-widest leading-relaxed">
                Cruickshank Lane <br />
                Opposite UBA Head Office <br />
                Accra, Ghana
              </p>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-(--muted) uppercase tracking-[0.2em]">GPS</span>
              <p className="text-base font-bold text-(--foreground) uppercase tracking-widest">GR-077-1393</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
