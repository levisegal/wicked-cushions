"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { ColorVariant } from "@/app/page";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVariant: ColorVariant;
}

type ProcessingStatus = "idle" | "uploading" | "validating" | "generating" | "complete" | "error";

export default function UploadModal({ isOpen, onClose, selectedVariant }: UploadModalProps) {
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setGeneratedImage(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setUploadedImage(base64);
      setStatus("validating");

      try {
        const response = await fetch("/api/process-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64,
            colorVariant: selectedVariant,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Processing failed");
        }

        if (data.validationError) {
          setStatus("error");
          setErrorMessage(data.validationError);
          return;
        }

        setStatus("generating");
        
        // Poll or wait for generation (the API handles this)
        if (data.generatedImage) {
          setGeneratedImage(data.generatedImage);
          setStatus("complete");
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "An error occurred");
      }
    };

    reader.readAsDataURL(file);
  }, [selectedVariant]);

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
    setGeneratedImage(null);
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
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#ff6633] transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-lg font-medium mb-2">Upload a photo of your headphones</h3>
              <p className="text-gray-500 text-sm mb-4">
                We'll show you how the <span className="font-medium text-[#ff6633]">{selectedVariant.name}</span> earpads will look
              </p>
              <p className="text-gray-400 text-xs">
                Drag and drop or click to browse • PNG, JPG up to 10MB
              </p>
            </div>
          )}

          {(status === "uploading" || status === "validating" || status === "generating") && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#ff6633] border-t-transparent mb-4"></div>
              <p className="text-lg font-medium">
                {status === "uploading" && "Uploading image..."}
                {status === "validating" && "Checking image..."}
                {status === "generating" && "Generating preview..."}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {status === "generating" && "This may take 10-30 seconds"}
              </p>
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

          {status === "complete" && generatedImage && (
            <div className="space-y-6">
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
                  <p className="text-sm text-gray-500 mb-2">With {selectedVariant.name} earpads</p>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={generatedImage}
                      alt="Generated preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
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

