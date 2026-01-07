"use client";

import Image from "next/image";
import { useState } from "react";
import { ColorVariant } from "@/app/page";

interface ProductGalleryProps {
  selectedVariant: ColorVariant;
}

const galleryImages = [
  "/images/products/cooling-gel-main.jpg",
  "/images/products/cooling-gel-side.jpg",
  "/images/products/compatibility.jpg",
  "/images/products/thickness.png",
  "/images/products/headphones-preview.jpg",
];

export default function ProductGallery({ selectedVariant }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
        <Image
          src={galleryImages[selectedImage]}
          alt={selectedVariant.name}
          fill
          className="object-contain p-4"
          priority
        />
      </div>

      {/* Thumbnail Strip */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded">
          ◀
        </button>
        <div className="flex gap-2 overflow-x-auto flex-1">
          {galleryImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index ? "border-[#ff6633]" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
        <button className="p-2 hover:bg-gray-100 rounded">
          ▶
        </button>
      </div>
    </div>
  );
}

