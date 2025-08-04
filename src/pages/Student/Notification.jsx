import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const WarningNotification = ({ message, duration = 15000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    const animationTimer = setTimeout(() => {
      setIsAnimating(true);
    }, 100);

    // Auto-hide after duration
    const hideTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-sm transition-all duration-300 transform ${
        isAnimating 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-800">
              Profile Update Required
            </p>
            <p className="text-sm text-amber-700 mt-1">
              {message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 text-amber-600 hover:text-amber-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 bg-amber-200 rounded-full h-1 overflow-hidden">
          <div 
            className="bg-amber-600 h-full rounded-full transition-all duration-300 ease-linear"
            style={{
              width: isAnimating ? '0%' : '100%',
              transition: `width ${duration}ms linear`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WarningNotification;