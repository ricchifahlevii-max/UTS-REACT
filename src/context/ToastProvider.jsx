import { useCallback, useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import ToastContext from './ToastContext.jsx'

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const notify = useCallback((message) => {
    setToast({ id: Date.now(), message })
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(null), 3600)
    return () => window.clearTimeout(timer)
  }, [toast])

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {toast && (
        <div aria-live="polite" className="fixed bottom-5 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white shadow-xl sm:bottom-7">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-400/20 text-emerald-300"><Check size={16} /></span>
          <span className="flex-1">{toast.message}</span>
          <button aria-label="Tutup notifikasi" className="rounded-full p-1 text-stone-300 hover:bg-white/10 hover:text-white" onClick={() => setToast(null)} type="button"><X size={15} /></button>
        </div>
      )}
    </ToastContext.Provider>
  )
}
