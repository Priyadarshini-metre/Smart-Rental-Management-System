import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
  error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
};

const styles = {
  success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
  error: 'bg-rose-500/10 border-rose-500/20 text-rose-300',
  warning: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
};

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, removeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-sm animate-slideIn ${styles[toast.type]}`}>
      {icons[toast.type]}
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button onClick={() => removeToast(toast.id)} className="opacity-60 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
