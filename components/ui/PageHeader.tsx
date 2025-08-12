"use client";

import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  status?: {
    label: string;
    color: "green" | "blue" | "purple" | "red" | "yellow" | "gray";
  };
  backButton?: {
    label: string;
    href: string;
  };
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  status,
  backButton,
  actions,
}: PageHeaderProps) {
  const router = useRouter();

  const getStatusColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-800";
      case "blue":
        return "bg-blue-100 text-blue-800";
      case "purple":
        return "bg-purple-100 text-purple-800";
      case "red":
        return "bg-red-100 text-red-800";
      case "gray":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="mb-8">
      {backButton && (
        <button
          onClick={() => router.push(backButton.href)}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {backButton.label}
        </button>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          {status && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                status.color
              )}`}
            >
              {status.label}
            </span>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
}
