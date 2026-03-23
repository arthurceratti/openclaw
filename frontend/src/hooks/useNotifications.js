import { useState, useEffect } from 'react';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  const showSuccess = (message) => {
    setToast({ type: 'success', message, duration: 3000 });
    setTimeout(() => setToast(null), 3000);
  };

  const showError = (message) => {
    setToast({ type: 'error', message, duration: 5000 });
    setTimeout(() => setToast(null), 5000);
  };

  const showInfo = (message) => {
    setToast({ type: 'info', message, duration: 4000 });
    setTimeout(() => setToast(null), 4000);
  };

  const showWarning = (message) => {
    setToast({ type: 'warning', message, duration: 5000 });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return {
    notifications,
    toast,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
};

export default useNotifications;
