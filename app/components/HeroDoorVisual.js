"use client";

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useSpring } from 'framer-motion';
import { CheckCircle, FileText, Search } from 'lucide-react';

export default function HeroDoorVisual() {
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  
  // Throttle state update for mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Map scroll progress to door rotation
  const rawRotateY = useTransform(scrollY, [0, 500], [0, -65]);
  // Use a spring to smooth out the scroll rotation
  const rotateY = useSpring(rawRotateY, { stiffness: 100, damping: 20 });
  
  // Plant scale linked to scroll
  const rawScale = useTransform(scrollY, [0, 500], [0.8, 1]);
  const plantScale = useSpring(rawScale, { stiffness: 100, damping: 20 });

  // Floating animation configuration
  const floatAnim = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Logic to handle reduced motion and mobile
  const finalRotateY = prefersReducedMotion ? -65 : (isMobile ? -65 : rotateY);
  const finalPlantScale = prefersReducedMotion ? 1 : (isMobile ? 1 : plantScale);

  // Mobile initial animation config (auto-play)
  const mobileDoorInitial = isMobile && !prefersReducedMotion ? { rotateY: 0 } : false;
  const mobileDoorAnimate = isMobile && !prefersReducedMotion ? { rotateY: -65 } : false;
  const mobileDoorTransition = { duration: 2, ease: "easeOut", delay: 0.5 };
  
  const mobilePlantInitial = isMobile && !prefersReducedMotion ? { scale: 0.8 } : false;
  const mobilePlantAnimate = isMobile && !prefersReducedMotion ? { scale: 1 } : false;

  return (
    <div className="relative w-full h-full flex items-center justify-center [perspective:1500px]">
      
      {/* Background radial glow */}
      <div className="absolute inset-0 m-auto w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-radial from-[#F4A261]/20 via-[#F4A261]/5 to-transparent rounded-full blur-3xl" />

      {/* Behind the Door (Warm gradient + Plant) */}
      <div className="absolute w-[240px] h-[400px] md:w-[320px] md:h-[520px] rounded-t-full bg-gradient-to-b from-[#F4A261]/30 to-white overflow-hidden shadow-inner flex items-end justify-center border border-gray-100">
        <motion.div 
          style={{ scale: finalPlantScale }}
          initial={mobilePlantInitial}
          animate={mobilePlantAnimate}
          transition={mobileDoorTransition}
          className="w-4/5 origin-bottom text-[#2D6A4F] opacity-90"
        >
          {/* Simple vector plant */}
          <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 100 C50 60, 20 40, 10 70 C20 90, 45 95, 50 100 Z" />
            <path d="M50 100 C50 50, 80 30, 90 60 C80 80, 55 95, 50 100 Z" />
            <path d="M50 100 C50 40, 40 10, 50 5 C60 10, 50 40, 50 100 Z" />
          </svg>
        </motion.div>
      </div>

      {/* The Door Frame & Door */}
      <div className="relative w-[240px] h-[400px] md:w-[320px] md:h-[520px] [transform-style:preserve-3d]">
        <motion.div
          style={{ rotateY: finalRotateY, transformOrigin: 'left center' }}
          initial={mobileDoorInitial}
          animate={mobileDoorAnimate}
          transition={mobileDoorTransition}
          className="absolute inset-0 bg-[#2D6A4F] rounded-t-full shadow-2xl border-r border-[#1B4332] flex flex-col items-center justify-between py-12"
        >
          {/* Door panels styling */}
          <div className="w-2/3 h-1/3 rounded-t-full border-2 border-[#40916C] shadow-inner" />
          <div className="w-2/3 h-1/3 rounded-sm border-2 border-[#40916C] shadow-inner" />
          
          {/* Door Handle */}
          <div className="absolute right-4 top-1/2 w-4 h-12 bg-gray-200 rounded-full shadow-md" />
        </motion.div>
      </div>

      {/* Floating UI Cards */}
      <div className="absolute right-0 bottom-10 md:bottom-20 z-20 flex flex-col gap-4">
        <motion.div 
          animate={prefersReducedMotion ? {} : floatAnim}
          className="bg-white px-5 py-3 rounded-xl shadow-xl shadow-gray-200/50 flex items-center gap-3 border border-gray-100"
        >
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-status-confirmed">
            <FileText size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-heading">AI Document Review</p>
            <p className="text-xs text-status-confirmed font-medium flex items-center gap-1"><CheckCircle size={12}/> Complete</p>
          </div>
        </motion.div>

        <motion.div 
          animate={prefersReducedMotion ? {} : floatAnim}
          transition={{ ...floatAnim.transition, delay: 0.5 }}
          className="bg-white px-5 py-3 rounded-xl shadow-xl shadow-gray-200/50 flex items-center gap-3 border border-gray-100 -ml-8"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Search size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-heading">Rule Check + Citations</p>
            <p className="text-xs text-status-confirmed font-medium flex items-center gap-1"><CheckCircle size={12}/> Complete</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
