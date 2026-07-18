"use client";

import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const CountUp = ({ to, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime;
    const startValue = 0;
    
    const tick = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);
      
      if (progress < 1) {
        setCount(Math.floor(startValue + (to - startValue) * progress));
        requestAnimationFrame(tick);
      } else {
        setCount(to);
      }
    };
    
    requestAnimationFrame(tick);
  }, [isInView, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export default function StatsCounter() {
  const stats = [
    { label: "Document Accuracy", value: 98, suffix: "%" },
    { label: "Average Turnaround", value: 24, suffix: "hr" },
    { label: "Renter-Controlled", value: 100, suffix: "%" },
    { label: "Landlord Access", value: 0, suffix: "" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-center">
      {stats.map((stat, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-50"
        >
          <div className="font-heading text-4xl md:text-5xl font-bold text-accent-primary mb-2 tracking-tight">
            <CountUp to={stat.value} suffix={stat.suffix} />
          </div>
          <p className="text-sm md:text-base text-text-body font-medium uppercase tracking-wider">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
