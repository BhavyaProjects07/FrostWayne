'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Title = ({ title, description, visibleButton = true, href = '' }) => {
  return (
    <div className="flex flex-col items-center">
      {/* DO NOT wrap title in h2 */}
      <div>{title}</div>

      <Link
        href={href}
        className="flex items-center gap-5 text-sm text-slate-600 mt-2"
      >
        <p className="max-w-lg text-center">{description}</p>

        {visibleButton && (
          <span className="text-[#856358ff] flex items-center gap-1">
            VIEW MORE <ArrowRight size={14} />
          </span>
        )}
      </Link>
    </div>
  )
}

export default Title
