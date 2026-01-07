"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import ColorPicker from "@/components/ColorPicker";
import ProductInfo from "@/components/ProductInfo";
import Benefits from "@/components/Benefits";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import UploadModal from "@/components/UploadModal";

export type ColorVariant = {
  id: string;
  name: string;
  thumbnail: string;
  mainImage: string;
  price: number;
};

const colorVariants: ColorVariant[] = [
  { id: "black", name: "Black", thumbnail: "/images/products/variant-black.jpg", mainImage: "/images/products/cooling-gel-main.jpg", price: 30.95 },
  { id: "onyx", name: "Onyx", thumbnail: "/images/products/variant-onyx.jpg", mainImage: "/images/products/cooling-gel-main.jpg", price: 33.95 },
  { id: "grey", name: "Grey", thumbnail: "/images/products/variant-grey.jpg", mainImage: "/images/products/cooling-gel-main.jpg", price: 33.95 },
  { id: "green", name: "Green Galaxy", thumbnail: "/images/products/variant-green.jpg", mainImage: "/images/products/cooling-gel-main.jpg", price: 33.95 },
  { id: "red", name: "Red Camo", thumbnail: "/images/products/variant-red.jpg", mainImage: "/images/products/cooling-gel-main.jpg", price: 33.95 },
  { id: "white", name: "White", thumbnail: "/images/products/variant-white.jpg", mainImage: "/images/products/cooling-gel-main.jpg", price: 33.95 },
  { id: "speed", name: "Speed Racer", thumbnail: "/images/products/variant-speed.jpg", mainImage: "/images/products/cooling-gel-main.jpg", price: 33.95 },
  { id: "electric", name: "Electric Tropics", thumbnail: "/images/products/variant-electric.jpg", mainImage: "/images/products/cooling-gel-main.jpg", price: 33.95 },
  { id: "tropical", name: "Tropical Sunset", thumbnail: "/images/products/variant-tropical.jpg", mainImage: "/images/products/cooling-gel-main.jpg", price: 33.95 },
];

export default function Home() {
  const [selectedVariant, setSelectedVariant] = useState(colorVariants[0]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb - hidden on mobile */}
      <div className="hidden md:block border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 text-sm">
          <span className="text-gray-900 hover:underline cursor-pointer">Home</span>
          <span className="mx-2 text-gray-400">■</span>
          <span className="text-gray-500">Audeze Maxwell Earpads - WC FreeZe Cooling Gel</span>
        </div>
      </div>

      {/* Main Product Section */}
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Left: Gallery */}
          <ProductGallery selectedVariant={selectedVariant} />
          
          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">4.8</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-[#ff6633]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500">(190)</span>
            </div>

            {/* Product Title */}
            <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide">
              Audeze Maxwell Earpads - WC FreeZe Cooling Gel
            </h1>

            {/* Price */}
            <div className="text-2xl md:text-3xl font-bold">
              ${selectedVariant.price.toFixed(2)}
            </div>

            {/* Afterpay */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Or 4 payments of</span>
              <span className="font-semibold">${(selectedVariant.price / 4).toFixed(2)}</span>
              <span className="text-gray-600">with</span>
              <div className="w-5 h-5 bg-[#00c8a0] rounded-full flex items-center justify-center text-white text-xs font-bold">$</div>
              <span className="font-semibold">Afterpay</span>
              <span className="text-gray-400 cursor-pointer">ⓘ</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
              <button className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-[#3a3a3a] text-white rounded-full text-xs md:text-sm hover:bg-[#4a4a4a]">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                <span className="hidden md:inline">Compatibility list</span>
                <span className="md:hidden">Compat.</span>
              </button>
              <button className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-[#3a3a3a] text-white rounded-full text-xs md:text-sm hover:bg-[#4a4a4a]">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M10 8l6 4-6 4V8z"/></svg>
                <span className="hidden md:inline">Installation Video</span>
                <span className="md:hidden">Install</span>
              </button>
              <button className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-[#3a3a3a] text-white rounded-full text-xs md:text-sm hover:bg-[#4a4a4a]">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="2"/><path d="M8 6h8M8 10h8M8 14h4" strokeWidth="2" strokeLinecap="round"/></svg>
                <span className="hidden md:inline">Cleaning & Care</span>
                <span className="md:hidden">Care</span>
              </button>
            </div>

            {/* Color Picker */}
            <ColorPicker
              variants={colorVariants}
              selectedVariant={selectedVariant}
              onSelect={setSelectedVariant}
            />

            {/* Quantity and Add to Cart */}
            <div className="flex gap-2 md:gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button className="px-3 md:px-4 py-2 md:py-3 text-lg md:text-xl hover:bg-gray-50">−</button>
                <span className="px-3 md:px-4 py-2 md:py-3 text-base md:text-lg">1</span>
                <button className="px-3 md:px-4 py-2 md:py-3 text-lg md:text-xl hover:bg-gray-50">+</button>
              </div>
              <button className="flex-1 bg-[#ff6633] text-white font-display text-lg md:text-xl py-3 md:py-4 rounded-lg hover:bg-[#e55a2b] transition-colors">
                ADD TO CART
              </button>
            </div>

            {/* Shop Pay */}
            <button className="w-full bg-[#5a31f4] text-white py-3 rounded-lg flex items-center justify-center gap-2">
              Buy with <span className="font-bold">Shop</span>Pay
            </button>

            {/* Prime */}
            <button className="w-full bg-[#00a8e1] text-white py-3 rounded-lg flex items-center justify-center gap-2">
              Buy with <span className="font-bold">prime</span>
            </button>

            {/* Try on Your Headphones - AI Feature */}
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l3.5 3.5M19 3l-3.5 3.5M12 3v4M5 21l3.5-3.5M19 21l-3.5-3.5M12 21v-4M3 12h4M21 12h-4M12 12l2.5-2.5M12 12l-2.5-2.5M12 12l2.5 2.5M12 12l-2.5 2.5" />
              </svg>
              <span className="font-semibold">Try on Your Headphones</span>
              <svg className="w-4 h-4 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L9.19 8.62 2 9.27l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7 5.46-4.73-7.19-.65L12 2z" />
              </svg>
            </button>

            {/* Delivery */}
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <span className="text-[#ff6633]">FREE delivery as soon as </span>
              <span className="font-bold">Tomorrow, Jan 8</span>
              <span className="text-[#ff6633]"> & easy returns for Prime members</span>
              <span className="text-[#00a8e1] font-bold ml-1">✓prime</span>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-4 border border-gray-200 rounded-lg overflow-hidden">
              {[
                { icon: "◎◎", label: "Comes as a Pair" },
                { icon: "🎧", label: "Unparalleled Ear Comfort" },
                { icon: "◀▶", label: "Extra Thick & Cozy" },
                { icon: "❄", label: "365 Day Guarantee" },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center justify-center py-4 md:py-6 border-r border-gray-200 last:border-r-0">
                  <span className="text-xl md:text-2xl mb-2">{feature.icon}</span>
                  <span className="text-[10px] md:text-xs text-center text-gray-600 px-1">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-[#ff6633]">💳</span>
                <span>Multiple payment options</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#ff6633]">📦</span>
                <span>Free shipping on all US orders of $40+</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#ff6633]">✓</span>
                <span>Easy Return & Guaranteed Refund</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <ProductInfo selectedVariant={selectedVariant} />
      </main>

      {/* Benefits Section */}
      <Benefits />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        selectedVariant={selectedVariant}
      />
    </div>
  );
}
