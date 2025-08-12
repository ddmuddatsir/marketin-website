"use client";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoCard({ title, children, className = "" }: InfoCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

// Komponen khusus untuk Summary dengan calculations
interface SummaryItemProps {
  label: string;
  value: string;
  isTotal?: boolean;
}

export function SummaryItem({
  label,
  value,
  isTotal = false,
}: SummaryItemProps) {
  return (
    <div className={`flex justify-between ${isTotal ? "border-t pt-2" : ""}`}>
      <span className={isTotal ? "text-lg font-semibold" : "text-gray-600"}>
        {label}
      </span>
      <span className={isTotal ? "text-lg font-bold" : "font-medium"}>
        {value}
      </span>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string | React.ReactNode;
}

export function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <span className="block text-sm text-gray-600">{label}</span>
      <div className="font-medium">{value}</div>
    </div>
  );
}
