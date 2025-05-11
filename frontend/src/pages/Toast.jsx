import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Toast = () => {
  const showSuccess = () => {
    toast.success('Hammasi joyida!');
  };

  const showError = () => {
    toast.error('Xatolik!');
  };

  return (
    <div>
      <button onClick={showSuccess}>Success Alert</button>
      <button onClick={showError}>Error Alert</button>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Toast;
