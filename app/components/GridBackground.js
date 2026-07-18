"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function GridBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Background Color */}
      <div className="absolute inset-0 bg-[#FAF7F2]" />
      
      {/* Crisp Grid lines */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M59 60V0H0' fill='none' stroke='%23000000' stroke-opacity='0.06' stroke-width='1.5'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px"
        }}
      />
      
      {/* Cursor glow tracking effect - only render after mount to prevent hydration mismatch */}
      {isClient && (
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-accent-primary/15 blur-[100px] will-change-transform"
          animate={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
          }}
          transition={{
            type: "tween",
            ease: "linear",
            duration: 0.1
          }}
        />
      )}
      
      {/* Edge fading mask */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAF7F2]/90" />
    </div>
  );
}
