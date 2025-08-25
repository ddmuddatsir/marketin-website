"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackSrc = "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image",
  priority = false,
  fill = false,
  sizes,
  style,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  // Debug logging
  console.log("SafeImage render:", { src, imgSrc, isError, alt });

  const handleError = () => {
    if (!isError) {
      console.log("SafeImage error for:", src, "falling back to:", fallbackSrc);
      setIsError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const imageProps = {
    src: imgSrc,
    alt,
    onError: handleError,
    className,
    priority,
    style,
    ...props,
  };

  if (fill) {
    return <Image {...imageProps} fill sizes={sizes} />;
  }

  return (
    <Image
      {...imageProps}
      width={width || 400}
      height={height || 400}
      sizes={sizes}
    />
  );
}
