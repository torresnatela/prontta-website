'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 56, text: 'text-2xl' },
  }

  const { icon, text } = sizes[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon - P with ECG line */}
      <motion.svg
        width={icon}
        height={icon}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background circle */}
        <circle cx="30" cy="30" r="28" fill="#E6F9FF" />
        
        {/* P letter */}
        <path
          d="M18 15V45H24V35H32C38.627 35 44 29.627 44 23C44 16.373 38.627 11 32 11H24C20.686 11 18 13.686 18 17V15Z"
          fill="#0D2137"
        />
        <path
          d="M24 17H32C35.314 17 38 19.686 38 23C38 26.314 35.314 29 32 29H24V17Z"
          fill="#E6F9FF"
        />
        
        {/* ECG Line */}
        <motion.path
          d="M8 38 L16 38 L20 32 L24 44 L28 28 L32 40 L36 38 L52 38"
          stroke="#00B4E6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
        />
      </motion.svg>

      {/* Text */}
      {showText && (
        <motion.div
          className={`font-display font-bold ${text}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="text-primary-navy">prontta</span>
          <span className="text-primary-cyan"> saúde</span>
        </motion.div>
      )}
    </div>
  )
}

