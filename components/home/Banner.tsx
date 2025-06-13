import Image from "next/image";
import React from "react";

const Banner = () => {
  return (
    <div className="relative w-full h-60 md:h-80 rounded-2xl overflow-hidden shadow-lg">
      <Image
        src="/banner.jpg"
        alt="Banner"
        layout="fill"
        objectFit="cover"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h1 className="text-white text-3xl md:text-4xl font-bold">
          Welcome to Our Shop
        </h1>
      </div>
    </div>
  );
};

export default Banner;
