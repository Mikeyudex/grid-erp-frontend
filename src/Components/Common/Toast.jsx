import React, { useEffect } from 'react';
import Toastify from 'toastify-js';

const ToastComponent = ({ text, duration, gravity, position, stopOnFocus, close, className, style }) => {

  useEffect(() => {
    const showToast = () => {
      Toastify({
        text: text,
        duration: duration,
        gravity: gravity,
        position: position,
        stopOnFocus: stopOnFocus,
        close: close,
        className: className,
        style: style,
      }).showToast();
    };

    showToast();
  }, [text, duration, gravity, position, stopOnFocus, close, className]);

  return null; // Since this component only handles side-effects, return null
};

export default ToastComponent;
