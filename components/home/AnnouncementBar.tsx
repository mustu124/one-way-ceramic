'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export function AnnouncementBar({ text }: { text: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(localStorage.getItem('owc-announcement-dismissed') !== 'true')
  }, [])

  if (!show) return null
  return (
    <div className="bg-brown px-4 py-2 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-sm">
        <p className="truncate">{text}</p>
        <button
          onClick={() => {
            localStorage.setItem('owc-announcement-dismissed', 'true')
            setShow(false)
          }}
          className="grid min-h-8 min-w-8 place-items-center rounded-full bg-white/10"
          aria-label="Dismiss announcement"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  )
}
