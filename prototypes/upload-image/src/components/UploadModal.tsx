"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import { ColorVariant } from "@/app/page";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVariant: ColorVariant;
}

type ProcessingStatus = "idle" | "uploading" | "validating" | "generating" | "complete" | "error";

// Rotating fun messages for each status
const LOADING_MESSAGES = {
  uploading: [
    { title: "Beaming up your photo ✨", subtitle: "Warming up the pixel teleporter" },
    { title: "Catching those pixels 📸", subtitle: "Almost got 'em..." },
    { title: "Uploading vibes 🚀", subtitle: "Your photo is on its way" },
    { title: "Preparing transmission 📡", subtitle: "Houston, we have an image" },
  ],
  validating: [
    { title: "Inspecting those cans... 🎧", subtitle: "Making sure these are actual headphones" },
    { title: "Scanning for headphones 🔍", subtitle: "No toasters allowed" },
    { title: "Analyzing your setup 👀", subtitle: "Nice headphones btw" },
    { title: "Running vibe check ✓", subtitle: "Looking good so far..." },
    { title: "Identifying your gear 🎯", subtitle: "Our AI has good taste" },
    { title: "Processing your photo 🖼️", subtitle: "This won't take long" },
  ],
  generating: [
    { title: "Cushioning in progress 🛋️", subtitle: "This usually takes ~30 seconds" },
    { title: "Stitching pixels together 🧵", subtitle: "One stitch at a time..." },
    { title: "Adding the comfy factor ☁️", subtitle: "Making it look cozy" },
    { title: "Generating magic ✨", subtitle: "AI is doing its thing" },
    { title: "Applying the drip 💧", subtitle: "Your headphones are getting an upgrade" },
    { title: "Crafting your preview 🎨", subtitle: "Good things take time" },
    { title: "Mixing the perfect blend 🎚️", subtitle: "Almost there..." },
    { title: "Rendering the goods 🖥️", subtitle: "Patience is a virtue" },
    { title: "Working some magic 🪄", subtitle: "The AI elves are busy" },
    { title: "Perfecting the details 💎", subtitle: "Quality takes time" },
    { title: "Putting it all together 🧩", subtitle: "Final touches incoming" },
    { title: "Making it happen 🔥", subtitle: "You're gonna love this" },
  ],
};

// Helper to convert image URL to base64
async function imageUrlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Compress image to max dimension and quality
async function compressImage(file: File, maxDimension = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      
      // Scale down if needed
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", quality);
      console.log("[Compress] Original:", Math.round(file.size / 1024), "KB → Compressed:", Math.round(compressed.length * 0.75 / 1024), "KB");
      resolve(compressed);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

interface GeneratedImage {
  image: string;
  angle: string;
}

const MODELS = [
  { id: "google/gemini-3-pro-image-preview", label: "Gemini 3 Pro" },
  { id: "bytedance-seed/seedream-4.5", label: "Seedream 4.5" },
];

export default function UploadModal({ isOpen, onClose, selectedVariant }: UploadModalProps) {
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedAngle, setSelectedAngle] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate through messages every 4 seconds during loading states
  useEffect(() => {
    if (status === "uploading" || status === "validating" || status === "generating") {
      const messages = LOADING_MESSAGES[status];
      const interval = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % messages.length);
      }, 4000);
      return () => clearInterval(interval);
    } else {
      setMessageIndex(0);
    }
  }, [status]);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image must be less than 10MB");
      return;
    }

    setStatus("uploading");
    setErrorMessage(null);
    setGeneratedImages([]);

    try {
      // Compress image before sending
      const base64 = await compressImage(file, 1200, 0.85);
      setUploadedImage(base64);
      setStatus("validating");
      console.log("[Upload] Image compressed and loaded, size:", Math.round(base64.length / 1024), "KB");

      try {
        // Load reference image (vertical only)
        const refImageUrls = [
          selectedVariant.verticalImage,
        ].filter(Boolean) as string[];
        
        console.log("[Upload] Loading", refImageUrls.length, "reference images:");
        refImageUrls.forEach((url, i) => console.log(`  [${i + 1}] ${url}`));
        const referenceImages = await Promise.all(
          refImageUrls.map(url => imageUrlToBase64(url))
        );
        console.log("[Upload] Reference images loaded, sending to API...");

        // Switch to "generating" after ~5s (validation is usually 4-5s)
        const generatingTimeout = setTimeout(() => setStatus("generating"), 5000);

        const response = await fetch("/api/process-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64,
            colorVariant: selectedVariant,
            referenceImages,
            model: selectedModel,
          }),
        });

        clearTimeout(generatingTimeout);
        
        console.log("[Upload] API response status:", response.status);
        const data = await response.json();
        console.log("[Upload] API response data:", data);

        if (!response.ok) {
          throw new Error(data.error || "Processing failed");
        }

        if (data.validationError) {
          console.log("[Upload] Validation failed:", data.validationError);
          setStatus("error");
          setErrorMessage(data.validationError);
          return;
        }
        
        // Handle multiple generated images from different angles
        if (data.generatedImages && data.generatedImages.length > 0) {
          console.log("[Upload] Generated", data.generatedImages.length, "angle views");
          setGeneratedImages(data.generatedImages);
          setSelectedAngle(0);
          setStatus("complete");
        }
      } catch (error) {
        console.error("[Upload] Error:", error);
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "An error occurred");
      }
    } catch (error) {
      console.error("[Upload] Compression error:", error);
      setStatus("error");
      setErrorMessage("Failed to process image");
    }
  }, [selectedVariant, selectedModel]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const resetState = useCallback(() => {
    setStatus("idle");
    setUploadedImage(null);
    setGeneratedImages([]);
    setSelectedAngle(0);
    setErrorMessage(null);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Try On Your Headphones</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === "idle" && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#ff6633] transition-colors"
            >
              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <input
                id="camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              
              <div className="text-5xl mb-4">📷</div>
              <h3 className="text-lg font-medium mb-2">Upload a photo of your headphones</h3>
              <p className="text-gray-500 text-sm mb-4">
                We'll show you how the <span className="font-medium text-[#ff6633]">{selectedVariant.name}</span> earpads will look
              </p>

              {/* Model toggle */}
              <div className="flex items-center justify-center gap-1 mb-6 p-1 bg-gray-100 rounded-lg w-fit mx-auto">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      selectedModel === m.id
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => document.getElementById('camera-input')?.click()}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#ff6633] text-white rounded-lg hover:bg-[#e55a2b] transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Take Photo
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Choose Photo
                </button>
              </div>
              
              <p className="text-gray-400 text-xs mt-4">
                PNG, JPG up to 10MB
              </p>
            </div>
          )}

          {(status === "uploading" || status === "validating" || status === "generating") && (
            <div className="relative">
              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[
                  { key: "uploading", label: "Upload" },
                  { key: "validating", label: "Analyze" },
                  { key: "generating", label: "Generate" },
                ].map((step, idx) => {
                  const stepOrder = ["uploading", "validating", "generating"];
                  const currentIdx = stepOrder.indexOf(status);
                  const stepIdx = stepOrder.indexOf(step.key);
                  const isComplete = stepIdx < currentIdx;
                  const isCurrent = stepIdx === currentIdx;
                  
                  return (
                    <div key={step.key} className="flex items-center gap-2">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all duration-500
                        ${isComplete 
                          ? "bg-[#ff6633] text-white" 
                          : isCurrent 
                            ? "bg-gradient-to-r from-[#ff6633] to-[#ff3366] text-white ai-step-pulse" 
                            : "bg-gray-200 text-gray-400"
                        }
                      `}>
                        {isComplete ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span className={`text-sm font-medium transition-colors ${isCurrent ? "text-gray-900" : "text-gray-400"}`}>
                        {step.label}
                      </span>
                      {idx < 2 && (
                        <div className={`w-8 h-0.5 mx-1 transition-colors ${isComplete ? "bg-[#ff6633]" : "bg-gray-200"}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Main Loading Area */}
              <div className="relative mx-auto w-64 h-64 mb-8">
                {/* Uploaded image preview with overlay */}
                {uploadedImage && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <img 
                      src={uploadedImage} 
                      alt="Processing" 
                      className="w-full h-full object-contain opacity-40"
                    />
                  </div>
                )}
                
                {/* Animated rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="ai-ring ai-ring-1 absolute w-48 h-48 rounded-full border-2 border-[#ff6633]/30" />
                  <div className="ai-ring ai-ring-2 absolute w-56 h-56 rounded-full border border-[#ff3366]/20" />
                  <div className="ai-ring ai-ring-3 absolute w-64 h-64 rounded-full border border-[#9933ff]/10" />
                </div>

                {/* Center orb */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 ai-orb-glow rounded-full bg-gradient-to-r from-[#ff6633] via-[#ff3366] to-[#9933ff] blur-xl opacity-50" />
                    
                    {/* Main orb */}
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#ff6633] via-[#ff3366] to-[#9933ff] flex items-center justify-center ai-orb-spin">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        {status === "uploading" && (
                          <svg className="w-8 h-8 text-[#ff6633] ai-icon-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        )}
                        {status === "validating" && (
                          <svg className="w-8 h-8 text-[#ff3366] ai-icon-scan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                        )}
                        {status === "generating" && (
                          <svg className="w-8 h-8 text-[#9933ff] ai-sparkle-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="ai-particle ai-particle-1 absolute w-2 h-2 rounded-full bg-[#ff6633]" />
                  <div className="ai-particle ai-particle-2 absolute w-1.5 h-1.5 rounded-full bg-[#ff3366]" />
                  <div className="ai-particle ai-particle-3 absolute w-2 h-2 rounded-full bg-[#9933ff]" />
                  <div className="ai-particle ai-particle-4 absolute w-1 h-1 rounded-full bg-[#33ccff]" />
                </div>
              </div>

              {/* Status text - rotating messages */}
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 mb-1 transition-opacity duration-300">
                  {(status === "uploading" || status === "validating" || status === "generating") && 
                    LOADING_MESSAGES[status][messageIndex % LOADING_MESSAGES[status].length].title
                  }
                </p>
                <p className="text-sm text-gray-500 transition-opacity duration-300">
                  {(status === "uploading" || status === "validating" || status === "generating") && 
                    LOADING_MESSAGES[status][messageIndex % LOADING_MESSAGES[status].length].subtitle
                  }
                </p>
                {status === "generating" && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <div className="ai-dots flex gap-1">
                      <span className="ai-dot w-1.5 h-1.5 rounded-full bg-[#ff6633]" />
                      <span className="ai-dot w-1.5 h-1.5 rounded-full bg-[#ff3366]" />
                      <span className="ai-dot w-1.5 h-1.5 rounded-full bg-[#9933ff]" />
                    </div>
                    <span>~20 seconds</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium mb-2 text-red-600">Unable to process image</h3>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <button
                onClick={resetState}
                className="px-6 py-3 bg-[#ff6633] text-white rounded-lg hover:bg-[#e55a2b] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {status === "complete" && generatedImages.length > 0 && (
            <div className="space-y-6">
              {/* Main comparison view */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Your headphones</p>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {uploadedImage && (
                      <img
                        src={uploadedImage}
                        alt="Uploaded headphones"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    {generatedImages[selectedAngle]?.angle} — {selectedVariant.name}
                  </p>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={generatedImages[selectedAngle]?.image}
                      alt={`${generatedImages[selectedAngle]?.angle} with ${selectedVariant.name} earpads`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Angle selector thumbnails */}
              {generatedImages.length > 1 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">View from different angles:</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {generatedImages.map((gen, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedAngle(idx)}
                        className={`flex-shrink-0 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === selectedAngle
                            ? "border-[#ff6633] ring-2 ring-[#ff6633] ring-offset-1"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <img
                          src={gen.image}
                          alt={gen.angle}
                          className="w-full aspect-square object-contain bg-gray-50"
                        />
                        <p className="text-xs text-center py-1 bg-gray-100 truncate px-1">
                          {gen.angle}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={resetState}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Try Another Photo
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 bg-[#ff6633] text-white rounded-lg hover:bg-[#e55a2b] transition-colors font-display"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 text-center text-xs text-gray-500">
          Your image is processed securely and not stored
        </div>
      </div>
    </div>
  );
}

