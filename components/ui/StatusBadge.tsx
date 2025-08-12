"use client";

export type StatusColor =
  | "green"
  | "blue"
  | "purple"
  | "red"
  | "yellow"
  | "gray";

interface StatusBadgeProps {
  status: string;
  color?: StatusColor;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({
  status,
  color,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  // Auto-detect color based on status if not provided
  const getStatusColor = (
    status: string,
    providedColor?: StatusColor
  ): StatusColor => {
    if (providedColor) return providedColor;

    switch (status.toLowerCase()) {
      case "completed":
      case "success":
      case "active":
      case "delivered":
        return "green";
      case "processing":
      case "pending":
      case "in_progress":
        return "blue";
      case "shipped":
      case "in_transit":
        return "purple";
      case "cancelled":
      case "failed":
      case "error":
        return "red";
      case "draft":
      case "inactive":
        return "gray";
      default:
        return "yellow";
    }
  };

  const getColorClasses = (color: StatusColor) => {
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

  const getSizeClasses = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-xs";
      case "lg":
        return "px-4 py-2 text-base";
      default:
        return "px-3 py-1 text-sm";
    }
  };

  const statusColor = getStatusColor(status, color);
  const colorClasses = getColorClasses(statusColor);
  const sizeClasses = getSizeClasses(size);

  return (
    <span
      className={`inline-block rounded-full font-medium ${colorClasses} ${sizeClasses} ${className}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
