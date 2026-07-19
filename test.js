import React from 'react'; export default function Test() { return (                 initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full lg:w-1/2 relative z-10 mt-10 lg:mt-0"
              >
                  <svg viewBox="0 0 500 500" className="w-full h-full relative z-10" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.9" />
                      </linearGradient>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#334155" />
                      </linearGradient>
                      <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="15" stdDeviation="20" floodColor="#000000" floodOpacity="0.1" />
                      </filter>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Main Dashboard Window */}
                    <motion.g 
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      filter="url(#glass)"
                    >
                      <rect x="40" y="60" width="420" height="340" rx="16" fill="url(#bgGrad)" stroke="#e2e8f0" strokeWidth="2" />
                      
                      {/* Window Controls */}
                      <circle cx="60" cy="80" r="4" fill="#ef4444" />
                      <circle cx="75" cy="80" r="4" fill="#eab308" />
                      <circle cx="90" cy="80" r="4" fill="#22c55e" />
                      <line x1="40" y1="100" x2="460" y2="100" stroke="#e2e8f0" strokeWidth="1" />
                      
                      {/* Header Text */}
                      <text x="60" y="130" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#0f172a">Compliance Overview</text>
                      <text x="60" y="150" fontFamily="sans-serif" fontSize="10" fill="#64748b">Real-time LIHTC Eligibility Metrics</text>

                      {/* KPI 1: Income vs Limit Bar Chart */}
                      <rect x="60" y="180" width="180" height="120" rx="8" fill="#ffffff" stroke="#f1f5f9" strokeWidth="2" />
                      <text x="75" y="205" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#334155">Income vs Limit</text>
                      
                      {/* Limit Bar (Static) */}
                      <rect x="75" y="220" width="150" height="12" rx="6" fill="#e2e8f0" />
                      <rect x="75" y="220" width="150" height="12" rx="6" fill="#94a3b8" opacity="0.3" />
                      
                      {/* Income Bar (Animated) */}
                      <motion.rect 
                        x="75" y="245" height="12" rx="6" fill="url(#accentGrad)"
                        initial={{ width: 0 }}
                        animate={{ width: 110 }}
                        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                      />
                      <motion.text 
                        x="75" y="275" fontFamily="sans-serif" fontSize="10" fill="#10b981" fontWeight="bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >✓ Below 60% AMI Threshold</motion.text>

                      {/* KPI 2: Circular Progress (Trust Score) */}
                      <rect x="260" y="180" width="140" height="120" rx="8" fill="#ffffff" stroke="#f1f5f9" strokeWidth="2" />
                      <text x="330" y="205" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#334155" textAnchor="middle">Data Confidence</text>
                      
                      {/* Background Circle */}
                      <circle cx="330" cy="250" r="30" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                      {/* Animated Progress Circle */}
                      <motion.circle 
                        cx="330" cy="250" r="30" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round"
                        strokeDasharray="188.5"
                        initial={{ strokeDashoffset: 188.5 }}
                        animate={{ strokeDashoffset: 18.85 }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                        transform="rotate(-90 330 250)"
                      />
                      <motion.text 
                        x="330" y="254" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#0f172a" textAnchor="middle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >99%</motion.text>

                      {/* Smooth Area Chart (Projections) */}
                      <rect x="60" y="320" width="340" height="60" rx="8" fill="#ffffff" stroke="#f1f5f9" strokeWidth="2" />
                      <motion.path 
                        d="M 60 380 L 60 360 C 100 360, 150 330, 200 350 C 250 370, 300 320, 350 340 C 380 350, 400 330, 400 330 L 400 380 Z" 
                        fill="url(#chartGrad)"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                        style={{ clipPath: "inset(0 0 0 0 round 0 0 8px 8px)" }}
                      />
                      <motion.path 
                        d="M 60 360 C 100 360, 150 330, 200 350 C 250 370, 300 320, 350 340 C 380 350, 400 330, 400 330" 
                        fill="none" stroke="#10b981" strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                      />
                    </motion.g>

                    {/* Floating Hover Badge 1 */}
                    <motion.g 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
                      transition={{ opacity: { delay: 1.8 }, x: { delay: 1.8 }, y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
                      filter="url(#glass)"
                    >
                      <rect x="10" y="140" width="130" height="40" rx="20" fill="#0f172a" />
                      <circle cx="30" cy="160" r="8" fill="#10b981" filter="url(#glow)" />
                      <text x="45" y="164" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#ffffff">Verified Stub</text>
                    </motion.g>

                    {/* Floating Hover Badge 2 */}
                    <motion.g 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0, y: [0, 5, 0] }}
                      transition={{ opacity: { delay: 2.1 }, x: { delay: 2.1 }, y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" } }}
                      filter="url(#glass)"
                    >
                      <rect x="340" y="280" width="150" height="40" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                      <text x="355" y="304" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#0f172a">Annual: $42,500</text>
                      <circle cx="470" cy="300" r="12" fill="#dbeafe" />
                      <path d="M 466 300 L 469 303 L 474 297" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    </motion.g>

                  </svg>
                </div>
              </motion.div>
 ); }