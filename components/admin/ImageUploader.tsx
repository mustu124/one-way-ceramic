'use client'

import Image from 'next/image'
import { Upload } from 'lucide-react'
import { useRef, useState } from 'react'

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export function ImageUploader({
  currentUrl,
  onUploaded
}: {
  currentUrl?: string
  onUploaded: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(currentUrl || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleFile(file: File) {
    setError('')
    if (!ACCEPTED.includes(file.type)) {
      setError('Please upload JPG, PNG or WebP only.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be 5MB or smaller.')
      return
    }
    setPreview(URL.createObjectURL(file))
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(json.error || 'Upload failed')
      return
    }
    onUploaded(json.url)
    setPreview(json.url)
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={(event) => {
          event.preventDefault()
          const file = event.dataTransfer.files[0]
          if (file) void handleFile(file)
        }}
        onDragOver={(event) => event.preventDefault()}
        className="grid min-h-40 w-full place-items-center rounded-lg border border-dashed border-brown/25 bg-white p-4 text-center"
      >
        {preview ? (
          <span className="relative block aspect-square w-32 overflow-hidden rounded-lg bg-beige">
            <Image src={preview} alt="Product preview" fill className="object-cover" unoptimized />
          </span>
        ) : (
          <span className="grid gap-2 text-sm text-text-light">
            <Upload className="mx-auto" />
            Drag and drop or click to browse
          </span>
        )}
        {loading && <span className="mt-2 text-sm text-gold-dark">Uploading...</span>}
      </button>
      <input ref={inputRef} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => event.target.files?.[0] && void handleFile(event.target.files[0])} />
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  )
}
