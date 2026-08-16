import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (message: string, title: string = 'Berhasil') => showToast(message, 'success', title),
    [showToast]
  );

  const showError = useCallback(
    (message: string, title: string = 'Terjadi Kesalahan') => showToast(message, 'error', title),
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, title: string = 'Informasi') => showToast(message, 'info', title),
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, title: string = 'Perhatian') => showToast(message, 'warning', title),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, showSuccess, showError, showInfo, showWarning, removeToast }}
    >
      {children}

      {/* Floating Toast Container */}
      <div
        aria-live="polite"
        className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const typeStyles = {
            success: {
              border: 'border-emerald-500/30',
              bg: 'bg-emerald-50 text-emerald-950',
              iconBg: 'bg-emerald-500 text-white',
              titleColor: 'text-emerald-900',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ),
            },
            error: {
              border: 'border-rose-500/30',
              bg: 'bg-rose-50 text-rose-950',
              iconBg: 'bg-rose-500 text-white',
              titleColor: 'text-rose-900',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ),
            },
            warning: {
              border: 'border-amber-500/30',
              bg: 'bg-amber-50 text-amber-950',
              iconBg: 'bg-amber-500 text-white',
              titleColor: 'text-amber-900',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ),
            },
            info: {
              border: 'border-blue-500/30',
              bg: 'bg-blue-50 text-blue-950',
              iconBg: 'bg-blue-600 text-white',
              titleColor: 'text-blue-900',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md animate-slide-up transition-all ${typeStyles.bg} ${typeStyles.border}`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 shadow-sm ${typeStyles.iconBg}`}>
                {typeStyles.icon}
              </div>
              <div className="flex-1 text-sm pt-0.5">
                {toast.title && (
                  <p className={`font-semibold tracking-tight ${typeStyles.titleColor}`}>
                    {toast.title}
                  </p>
                )}
                <p className="text-slate-700 leading-snug mt-0.5">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-black/5 transition"
                aria-label="Tutup notifikasi"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
