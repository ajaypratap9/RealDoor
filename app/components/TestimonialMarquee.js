"use client";

import { motion } from "framer-motion";

export default function TestimonialMarquee() {
  const testimonials = [
    { quote: "Finally, I understood what I needed without paying a lawyer.", author: "Maria S.", tag: "Renter" },
    { quote: "The checklist saved me weeks of back-and-forth with my property manager.", author: "James T.", tag: "Applicant" },
    { quote: "It didn't promise me a home, but it got my packet 100% ready.", author: "Linda W.", tag: "Renter" },
    { quote: "Extracted my pay stubs perfectly. Zero manual entry.", author: "Carlos R.", tag: "Applicant" },
    { quote: "I felt completely in control of my data the entire time.", author: "Sarah M.", tag: "Renter" },
    { quote: "The HUD math made sense for the first time in my life.", author: "David K.", tag: "Applicant" },
  ];

  // Duplicate for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="relative py-24 bg-white overflow-hidden border-y border-gray-100">
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none" />
      
      <div className="mb-12 text-center relative z-20">
        <h3 className="font-heading text-3xl md:text-4xl font-bold text-text-heading mb-4">Trusted by renters everywhere</h3>
        <p className="text-text-body text-lg max-w-2xl mx-auto">RealDoor brings transparency to the most stressful part of housing.</p>
      </div>

      <div className="flex w-[200%] md:w-[150%] lg:w-[120%]">
        <motion.div
          className="flex gap-6 whitespace-nowrap pl-6"
          animate={{ x: [0, -1035] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          {duplicatedTestimonials.map((t, i) => (
            <div key={i} className="inline-flex flex-col justify-between w-[350px] p-8 glass rounded-3xl shrink-0 hover:-translate-y-2 transition-transform duration-300">
              <svg className="w-8 h-8 text-accent-primary/40 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
              <p className="text-text-heading text-lg font-medium whitespace-pre-wrap leading-relaxed mb-8">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-dark flex items-center justify-center text-white font-bold text-sm">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="text-text-heading font-semibold text-sm">{t.author}</p>
                  <p className="text-text-body text-xs uppercase tracking-wider font-semibold">{t.tag}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
