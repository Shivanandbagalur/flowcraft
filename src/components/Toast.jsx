// File: src/components/Toast.jsx

const IconCheck = () => (
  <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconX = () => (
  <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type}`}>
        {toast.type === 'success' ? <IconCheck /> : <IconX />}
        {toast.message}
      </div>
    </div>
  )
}
