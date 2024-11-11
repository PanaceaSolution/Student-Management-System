import React, { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react"; 

const Alert = ({
  title,
  message,
  variant = "success",
  onDismiss,
  position = "top-center",
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onDismiss) {
        onDismiss();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  const variantStyles = {
    success: "border-green-100 bg-green-50 text-green-600",
    error: "border-red-100 bg-red-50 text-red-600",
    warning: "border-yellow-100 bg-yellow-50 text-yellow-600",
    info: "border-blue-100 bg-blue-50 text-blue-600",
  };

  const positionStyles = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  // Icons based on the variant
  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    warning: <AlertTriangle className="w-6 h-6 text-red-600" />,
    info: <Info className="w-6 h-6" />,
  };

  return (
    <>
      <div
        role="alert"
        className={`fixed ${positionStyles[position]} rounded-md border shadow-lg ${variantStyles[variant]} p-4 z-50 w-9/12 max-w-md`}
      >
        <div className="flex items-start gap-4">
          <span className={variantStyles[variant]}>
            {icons[variant]} {/* Render the corresponding icon */}
          </span>

          <div className="flex-1">
            <strong className="block font-medium text-gray-900">{title}</strong>
            <p className="mt-1 text-sm text-gray-700 text-nowrap">{message}</p>
          </div>

          <button
            className="text-gray-500 transition hover:text-gray-600"
            onClick={() => setVisible(false)}
          >
            <span className="sr-only">Dismiss popup</span>
            <XCircle className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Alert;
