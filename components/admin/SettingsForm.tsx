'use client'

import { useState } from 'react'
import type { SiteSettings } from '@/types'

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [values, setValues] = useState(settings)
  const [message, setMessage] = useState('')

  async function save() {
    setMessage('')
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })
    setMessage(res.ok ? 'Settings saved.' : 'Could not save settings.')
  }

  return (
    <div className="rounded-lg bg-white p-5 shadow-soft">
      <h2 className="font-heading text-3xl font-semibold">Site Settings</h2>
      <div className="mt-4 grid gap-4">
        <label className="grid gap-1 text-sm font-medium">Announcement bar text<input className="admin-input" value={values.announcement_text} onChange={(e) => setValues({ ...values, announcement_text: e.target.value })} /></label>
        <label className="grid gap-1 text-sm font-medium">Offer strip text<input className="admin-input" value={values.offer_text} onChange={(e) => setValues({ ...values, offer_text: e.target.value })} /></label>
      </div>
      <button onClick={save} className="mt-5 min-h-11 rounded-full bg-brown px-5 font-semibold text-white">Save Settings</button>
      {message && <p className="mt-3 text-sm text-text-light">{message}</p>}
    </div>
  )
}
