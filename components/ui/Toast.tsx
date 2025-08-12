"use client";
import React from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import { useToast } from "@/contexts/ToastContext";
import { Toast as ToastType } from "@/types/toast";

interface ToastProps {
  toast: ToastType;
}

export default function Toast({ toast }: ToastProps) {
  const { removeToast } = useToast();

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <FaExclamationTriangle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <FaExclamationTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <FaInfoCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <FaInfoCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200 shadow-green-100";
      case "error":
        return "bg-red-50 border-red-200 shadow-red-100";
      case "warning":
        return "bg-yellow-50 border-yellow-200 shadow-yellow-100";
      case "info":
        return "bg-blue-50 border-blue-200 shadow-blue-100";
      default:
        return "bg-gray-50 border-gray-200 shadow-gray-100";
    }
  };

  return (
    <div
      className={`
        ${getBgColor()}
        border rounded-lg p-4 shadow-lg max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        hover:shadow-xl
      `}
      style={{
        animation: "fadeInScale 0.3s ease-out",
      }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>

        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-200"
              aria-label="Close notification"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {toast.message && (
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">
              {toast.message}
            </p>
          )}

          {toast.action && (
            <div className="mt-3">
              <button
                onClick={() => {
                  toast.action?.onClick();
                  removeToast(toast.id);
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline"
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
