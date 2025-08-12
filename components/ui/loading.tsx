import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  type?: "skeleton" | "spinner" | "custom";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function Loading({
  type = "skeleton",
  size = "md",
  className = "",
  children,
}: LoadingProps) {
  if (type === "spinner") {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
    };

    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
        {children && <span className="ml-2">{children}</span>}
      </div>
    );
  }

  if (type === "custom" && children) {
    return <div className={className}>{children}</div>;
  }

  // Default skeleton loading
  const heights = {
    sm: "h-20",
    md: "h-32",
    lg: "h-48",
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Skeleton className={`w-full ${heights[size]}`} />
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-1/2 h-4" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <Skeleton className="w-full aspect-square" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-1/4" />
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      <div className="flex flex-col md:flex-row gap-10">
        <Skeleton className="md:w-1/2 aspect-square" />
        <div className="md:w-1/2 space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-24 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
