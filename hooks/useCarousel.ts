"use client";

import { useState } from "react";

export function useCarousel(totalItems: number, itemsPerSlide: number) {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const next = () =>
    setCarouselIndex((prev) =>
      Math.min(prev + itemsPerSlide, totalItems - itemsPerSlide)
    );

  const prev = () =>
    setCarouselIndex((prev) => Math.max(prev - itemsPerSlide, 0));

  const visibleRange = {
    start: carouselIndex,
    end: carouselIndex + itemsPerSlide,
  };

  return { carouselIndex, next, prev, visibleRange };
}
