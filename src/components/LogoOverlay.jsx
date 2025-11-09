import React from 'react'

/**
 * LogoOverlay renders a subtle purple "Z" watermark that can be placed over
 * any product image area. It uses an inline SVG with a gradient fill so we
 * don’t depend on external assets. Opacity and size are configurable.
 */
export default function LogoOverlay({ size = 96, opacity = 0.35 }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
        style={{ opacity }}
      >
        <defs>
          <linearGradient id="zGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--zpurple)" />
            <stop offset="100%" stopColor="var(--zpink)" />
          </linearGradient>
        </defs>
        {/* Simple geometric Z shape */}
        <path
          d="M10 18 H90 L30 82 H90 V92 H10 L70 28 H10 Z"
          fill="url(#zGradient)"
        />
        {/* Thin outline to pop on dark backgrounds */}
        <path
          d="M10 18 H90 L30 82 H90 V92 H10 L70 28 H10 Z"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  )
}

