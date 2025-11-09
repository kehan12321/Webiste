import React from 'react'
import brandIcon from '../assets/zaliant3d.png'

/**
 * BrandBadge renders a solid gradient square with the Z logo inside.
 * Place it inside any image container; it anchors to the bottom-left by default.
 */
export default function BrandBadge({ className = 'absolute bottom-2 left-2 z-20', size = 36, iconSrc }) {
  return (
    <div className={`pointer-events-none ${className} rounded-md p-1 bg-gradient-to-br from-[var(--zpurple)] to-[var(--zpink)] shadow-z`}>
      <img src={iconSrc || brandIcon} alt="brand" width={size} height={size} />
    </div>
  )
}
