"use client";

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
        {variants.map((variant) => {
          const isSelected = selectedVariant.id === variant.id;
          return (
            <button
              key={variant.id}
              onClick={() => onSelect(variant)}
              className={`relative w-[38px] h-[38px] rounded-lg border transition-all bg-cover bg-center bg-no-repeat ${
                isSelected
                  ? "border-[#ff6633] bg-[length:90%]"
                  : "border-transparent hover:border-gray-300"
              }`}
              style={{
                backgroundImage: isSelected
                  ? `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='3'/%3E%3C/svg%3E"), url(${variant.thumbnail})`
                  : `url(${variant.thumbnail})`,
              }}
              title={variant.name}
              aria-label={variant.name}
            />
          );
        })}
      </div>
    </div>
  );
}

