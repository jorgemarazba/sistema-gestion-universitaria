import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle, XCircle, X, GraduationCap } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string, type: 'success' | 'error') => void;
  removeToast: (id: string) => void;
  ToastContainer: () => ReactNode;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const ToastContainer = (): ReactNode => (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`transform transition-all duration-500 ease-out animate-in slide-in-from-right-4 fade-in ${
            toast.type === 'success' 
              ? 'bg-linear-to-r from-blue-600 to-blue-700 border-blue-400' 
              : 'bg-linear-to-r from-red-600 to-red-700 border-red-400'
          } text-white px-5 py-4 rounded-xl shadow-2xl border-l-4 max-w-md flex items-start gap-3`}
          role="alert"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' ? (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <GraduationCap size={20} className="text-white" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <XCircle size={20} className="text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight">
              {toast.type === 'success' ? '¡Éxito!' : 'Error'}
            </p>
            <p className="text-white/90 text-sm mt-1 leading-relaxed">
              {toast.message}
            </p>
          </div>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Cerrar notificación"
          >
            <X size={16} className="text-white/80" />
          </button>
        </div>
      ))}
    </div>
  );

  return { toasts, showToast, removeToast, ToastContainer };
}

export default useToast;
