import { type ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
  className?: string
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
}

const FOCUSABLE = ['a[href]', 'button:not([disabled])', 'textarea', 'input', 'select', '[tabindex]:not([tabindex="-1"])'].join(', ')

export function Modal({ isOpen, onClose, title, children, footer, size = 'md', className = '' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const panel = panelRef.current
    const getFocusable = () => panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []

    getFocusable()[0]?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab') {
        const els = Array.from(getFocusable())
        if (els.length === 0) {
          e.preventDefault()
          return
        }
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.classList.add('modal-open')

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('modal-open')
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined} className={`relative w-full rounded-t-2xl bg-white shadow-xl sm:rounded-2xl ${sizeClasses[size]} animate-slide-up flex max-h-[90vh] flex-col sm:mx-4 ${className}`}>
        {title && (
          <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between rounded-t-2xl border-b border-slate-100 bg-white p-4">
            <h2 id="modal-title" className="text-lg font-semibold text-slate-800">
              {title}
            </h2>
            <button onClick={onClose} aria-label="Close" className="-mr-2 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer && <div className="sticky bottom-0 shrink-0 border-t border-slate-100 bg-white p-4">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}
