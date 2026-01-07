"use client";

import { ColorVariant } from "@/app/page";

interface ProductInfoProps {
  selectedVariant: ColorVariant;
}

export default function ProductInfo({ selectedVariant }: ProductInfoProps) {
  return (
    <div className="mt-12 space-y-6">
      <div className="prose max-w-none">
        <h2 className="text-xl font-bold mb-4">Experience the FreeZe:</h2>
        <p className="text-gray-600">
          Do your ears get hot after several hours of using your headphones? WC FreeZe cooling gel ear pads compatible with Audeze Maxwell Headphones keep your ears cool for longer periods of time. A combination of Dual Layer cooling gel (interior layer, top layer), and a breathable hybrid of sports fabric and leather help you get through those long listening sessions.
        </p>

        <h3 className="text-lg font-bold mt-6 mb-2">Compatibility:</h3>
        <p className="text-gray-600">
          These earpads are made specifically to fit the Audeze Maxwell for XBOX, and PS5 Headphones ONLY. They WILL NOT FIT Audeze Maxwell 2 and any other Headsets.
        </p>

        <h3 className="text-lg font-bold mt-6 mb-2">Enhanced Comfort and Thickness:</h3>
        <p className="text-gray-600">
          These earpads compatible with Audeze Maxwell Headphones are much thicker than the original earpads, giving your ears more room in the ear cup to avoid touching the internal hard plastic components. Combined with professional-grade PU leather and an extremely breathable sports fabric, these earpads are perfect for long-term, crack-free comfort.
        </p>

        <h3 className="text-lg font-bold mt-6 mb-2">Enhanced Sound:</h3>
        <p className="text-gray-600">
          Your old, beat-up ear cushions are negatively affecting the sound performance of your headphones. With Dual Layer cooling gel and improved memory foam, these earpads comfortably conform to your ear, blocking out noise and dialing in the sound.
        </p>

        <h3 className="text-lg font-bold mt-6 mb-2">Easy Installation:</h3>
        <p className="text-gray-600">
          Detailed, step-by-step video will guide you through removing your old ear pads and installing your brand new WC FreeZe Hybrid Maxwell Replacement Earpads, making the entire process short and pain-free.
        </p>
      </div>

      {/* Specifications */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-bold mb-4">Specifications</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Material</span>
            <span>PU Leather / Sports Fabric</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Foam Type</span>
            <span>Memory Foam with Cooling Gel</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Full Length</span>
            <span>4.09 inch</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Full Width</span>
            <span>4.09 inch</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Internal Length</span>
            <span>2.06 inch</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Internal Width</span>
            <span>1.97 inch</span>
          </div>
        </div>
      </div>

      {/* Price Display */}
      <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-between">
        <div>
          <span className="text-3xl font-bold">${selectedVariant.price.toFixed(2)}</span>
          <span className="text-gray-500 ml-2">USD</span>
        </div>
        <div className="text-sm text-gray-500">
          or 4 interest-free payments of ${(selectedVariant.price / 4).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

