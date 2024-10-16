import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  interval?: number;
  width?: number;
  height?: number;
  className?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  interval = 2000,
  width = 200,
  height = 200,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  const actualWidth = Math.min(width, 200);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ width: actualWidth, height }}
    >
      {/* <img
				src={images[currentIndex]}
				alt={`Image ${currentIndex + 1}`}
				style={{ objectFit: "cover" }}
				className="transition-opacity duration-500"
			/> */}
      <Image
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        fill
        unoptimized
        style={{ objectFit: "cover" }}
        className="transition-opacity duration-500"
      />
    </div>
  );
};

export default ImageCarousel;
