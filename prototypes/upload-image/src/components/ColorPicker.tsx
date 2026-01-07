"use client";

import Image from "next/image";
import { ColorVariant } from "@/app/page";

interface ColorPickerProps {
  variants: ColorVariant[];
  selectedVariant: ColorVariant;
  onSelect: (variant: ColorVariant) => void;
}

export default function ColorPicker({ variants, selectedVariant, onSelect }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm">
        <span className="text-gray-500">Selected Color: </span>
        <span className="font-display font-bold uppercase">{selectedVariant.name}</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant)}
            className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
              selectedVariant.id === variant.id
                ? "border-[#ff6633] ring-2 ring-[#ff6633] ring-offset-1"
                : "border-gray-200 hover:border-gray-400"
            }`}
            title={variant.name}
          >
            <Image
              src={variant.thumbnail}
              alt={variant.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

