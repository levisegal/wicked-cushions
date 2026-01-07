import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface ColorVariant {
  id: string;
  name: string;
  thumbnail: string;
  mainImage: string;
  lifestyleImage?: string;
  verticalImage?: string;
  price: number;
}

interface RequestBody {
  image: string; // base64 data URL
  colorVariant: ColorVariant;
  referenceImages?: string[]; // base64 reference images of the earpad
}

async function validateImage(imageBase64: string): Promise<{ isValid: boolean; error?: string }> {
  if (!OPENROUTER_API_KEY) {
    return { isValid: false, error: "API key not configured" };
  }

  try {
    // Use cheap Gemini 2.5 Flash for validation
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://wickedcushions.com",
        "X-Title": "Wicked Cushions Earpad Preview",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this image and determine if it shows headphones. 
                
Respond with EXACTLY one of these responses:
- "VALID" if the image clearly shows headphones (over-ear or on-ear headphones)
- "NOT_HEADPHONES: [reason]" if the image does not show headphones
- "INAPPROPRIATE: [reason]" if the image contains inappropriate, NSFW, or offensive content
- "UNCLEAR: [reason]" if the image is too blurry, dark, or unclear to determine

Only respond with one of the above formats, nothing else.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Validation API error:", errorText);
      return { isValid: false, error: "Failed to validate image" };
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim() || "";

    if (result.startsWith("VALID")) {
      return { isValid: true };
    }

    if (result.startsWith("NOT_HEADPHONES")) {
      return { isValid: false, error: "Please upload an image of headphones. The image you provided doesn't appear to show headphones." };
    }

    if (result.startsWith("INAPPROPRIATE")) {
      return { isValid: false, error: "The uploaded image contains inappropriate content and cannot be processed." };
    }

    if (result.startsWith("UNCLEAR")) {
      return { isValid: false, error: "The image is too unclear. Please upload a clearer photo of your headphones." };
    }

    return { isValid: false, error: "Could not validate the image. Please try again." };
  } catch (error) {
    console.error("Validation error:", error);
    return { isValid: false, error: "Failed to validate image" };
  }
}

const ANGLE_VIEWS = [
  { name: "Front View", rotation: "front-facing, straight on" },
  { name: "3/4 Left", rotation: "rotated 45 degrees to the left, showing left earpad prominently" },
  { name: "3/4 Right", rotation: "rotated 45 degrees to the right, showing right earpad prominently" },
  { name: "Side View", rotation: "profile view from the side, showing earpad depth" },
];

// Helper to get detailed color description for prompts
function getColorDescription(variantName: string): string {
  const descriptions: Record<string, string> = {
    "Black": "solid matte black leather",
    "90s Black": "black with retro 90s geometric white pattern accents",
    "Geo Grey": "grey with geometric angular pattern design",
    "Red Camo": "red and black camouflage pattern",
    "90s White": "white with retro 90s colorful geometric shapes",
    "Speed Racer": "racing-inspired red, white and black stripes",
    "Emerald Tide": "deep emerald green with wave-like pattern",
    "Ivory Tide": "cream/ivory white with subtle wave pattern",
    "The Simulation": "Matrix-inspired green and black digital rain pattern",
    "Kinetic Wave": "dynamic blue wave pattern with motion effect",
  };
  return descriptions[variantName] || `${variantName} colored`;
}

async function generateWithGemini3Pro(
  imageBase64: string,
  variant: ColorVariant,
  referenceImages: string[],
  angleView: { name: string; rotation: string; prompt: string }
): Promise<{ success: boolean; image?: string; angle?: string; error?: string }> {
  const startTime = Date.now();
  console.log(`[API] Generating ${angleView.name} with Gemini 3 Pro Image...`);
  
  const colorDescription = getColorDescription(variant.name);

  try {
    // Use Gemini 3 Pro Image Preview with modalities for image generation
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://wickedcushions.com",
        "X-Title": "Wicked Cushions Earpad Preview",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        modalities: ["image", "text"],
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: angleView.prompt
                  .replace("{variant}", variant.name)
                  .replace("{colorDescription}", colorDescription),
              },
              {
                type: "image_url",
                image_url: { url: imageBase64 },
              },
              // Include reference image for color matching
              ...(referenceImages[0] ? [
                {
                  type: "text" as const,
                  text: `Reference image of the ${variant.name} earpad color/pattern to match:`,
                },
                {
                  type: "image_url" as const,
                  image_url: { url: referenceImages[0] },
                },
              ] : []),
            ],
          },
        ],
        max_tokens: 4096,
      }),
    });

    console.log(`[API] Gemini 3 Pro response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Gemini 3 Pro ${angleView.name} failed:`, response.status, errorText.slice(0, 300));
      return generateWithReferenceImage(imageBase64, variant, referenceImages, angleView);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;
    
    console.log(`[API] ${angleView.name} response keys:`, Object.keys(message || {}));
    if (message?.images) {
      console.log(`[API] ${angleView.name} images array length:`, message.images.length);
    }

    // OpenRouter image generation response format:
    // message.images: [{ type: "image_url", image_url: { url: "data:image/png;base64,..." } }]
    if (message?.images && message.images.length > 0) {
      const imageData = message.images[0];
      // Handle OpenRouter format: { type: "image_url", image_url: { url: "..." } }
      const imageUrl = imageData.image_url?.url || imageData.url || imageData;
      if (imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("data:image")) {
        console.log(`[API] ${angleView.name} ✓ got image from message.images, took: ${Date.now() - startTime}ms`);
        return { success: true, image: imageUrl, angle: angleView.name };
      }
      console.log(`[API] ${angleView.name} images[0] format:`, JSON.stringify(imageData).slice(0, 200));
    }

    // Fallback: Check for base64 in content string
    if (typeof message?.content === "string") {
      const base64Match = message.content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
      if (base64Match) {
        console.log(`[API] ${angleView.name} ✓ got base64 in content string, took: ${Date.now() - startTime}ms`);
        return { success: true, image: base64Match[0], angle: angleView.name };
      }
      console.log(`[API] ${angleView.name} text content (first 200):`, message.content.slice(0, 200));
    }

    // Fallback: Check for image parts in content array
    if (Array.isArray(message?.content)) {
      for (const part of message.content) {
        if (part.type === "image_url" && part.image_url?.url) {
          console.log(`[API] ${angleView.name} ✓ got image_url in content array, took: ${Date.now() - startTime}ms`);
          return { success: true, image: part.image_url.url, angle: angleView.name };
        }
      }
    }

    console.log(`[API] ${angleView.name} no image found, using reference image fallback`);
    return generateWithReferenceImage(imageBase64, variant, referenceImages, angleView);
  } catch (error) {
    console.error(`[API] Gemini 3 Pro ${angleView.name} error:`, error);
    return generateWithReferenceImage(imageBase64, variant, referenceImages, angleView);
  }
}

// Fallback: Use reference images when image generation isn't available
async function generateWithReferenceImage(
  imageBase64: string,
  variant: ColorVariant,
  referenceImages: string[],
  angleView: { name: string; rotation: string; prompt?: string }
): Promise<{ success: boolean; image?: string; angle?: string; error?: string }> {
  console.log(`[API] ${angleView.name} using reference image fallback`);
  
  // Map angle to reference image index
  const angleToRef: Record<string, number> = {
    "Your Photo": 0,     // mainImage (full view)
    "Studio Shot": 0,    // mainImage (full view)
  };
  
  const refIndex = angleToRef[angleView.name] || 0;
  const refImage = referenceImages[refIndex] || referenceImages[0] || imageBase64;
  
  return Promise.resolve({ success: true, image: refImage, angle: angleView.name });
}

// Two distinct views with tailored prompts
// Note: In the API call, the FIRST image is the user's uploaded photo, the SECOND image is the earpad reference
const VIEW_PROMPTS = [
  {
    name: "Your Photo",
    rotation: "original",
    prompt: `You are given two images:
1. USER'S PHOTO: The first image shows the user's actual headphones
2. EARPAD REFERENCE: The second image shows the {variant} replacement earpads

Edit the USER'S PHOTO: Keep everything exactly the same (their headphones, angle, background, lighting) but swap the earpads to match the EARPAD REFERENCE image exactly — same color, pattern, texture, and blue cooling gel strip.`,
  },
  {
    name: "Studio Shot",
    rotation: "studio",
    prompt: `You are given two images:
1. USER'S PHOTO: The first image shows the user's actual headphones — this is the EXACT headphone model to recreate
2. EARPAD REFERENCE: The second image shows the {variant} replacement earpads

Create a studio product photo with:
- The EXACT same headphone model from the USER'S PHOTO (same brand, shape, frame color, every detail)
- The earpads from the EARPAD REFERENCE (same color, pattern, blue cooling gel strip)
- Headphones placed on a minimal headphone stand
- Clean studio background, soft lighting

The headphones must be identical to the user's — only the earpads and background change.`,
  },
];

async function generatePreview(
  imageBase64: string, 
  variant: ColorVariant, 
  referenceImages: string[] = []
): Promise<{ success: boolean; images?: Array<{ image: string; angle: string }>; error?: string }> {
  if (!OPENROUTER_API_KEY) {
    return { success: false, error: "API key not configured" };
  }

  // Generate BOTH views in parallel with distinct prompts
  const results = await Promise.all(
    VIEW_PROMPTS.map(view => generateWithGemini3Pro(imageBase64, variant, referenceImages, view))
  );

  const successfulImages: Array<{ image: string; angle: string }> = results
    .filter(r => r.success && r.image)
    .map(r => ({ image: r.image!, angle: r.angle! }));

  if (successfulImages.length === 0) {
    return { success: false, error: "Failed to generate any previews" };
  }

  return { success: true, images: successfulImages };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log("[API] ========== New request ==========");
  
  try {
    const body: RequestBody = await request.json();
    const { image, colorVariant, referenceImages = [] } = body;

    console.log("[API] Variant:", colorVariant?.name);
    console.log("[API] Image size:", Math.round(image?.length / 1024), "KB");
    console.log("[API] Reference images:", referenceImages.length);

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!colorVariant) {
      return NextResponse.json({ error: "No color variant selected" }, { status: 400 });
    }

    // Step 1: Validate the image
    console.log("[API] Step 1: Validating image...");
    const validationStart = Date.now();
    const validation = await validateImage(image);
    console.log("[API] Validation took:", Date.now() - validationStart, "ms");
    console.log("[API] Validation result:", validation.isValid ? "VALID" : validation.error);
    
    if (!validation.isValid) {
      return NextResponse.json({ validationError: validation.error }, { status: 200 });
    }

    // Step 2: Generate previews from multiple angles
    console.log("[API] Step 2: Generating previews...");
    const generationStart = Date.now();
    const generation = await generatePreview(image, colorVariant, referenceImages);
    console.log("[API] Generation took:", Date.now() - generationStart, "ms");
    console.log("[API] Generated images:", generation.images?.length || 0);
    
    if (!generation.success) {
      return NextResponse.json({ error: generation.error }, { status: 500 });
    }

    console.log("[API] Total request time:", Date.now() - startTime, "ms");
    return NextResponse.json({ generatedImages: generation.images }, { status: 200 });
  } catch (error) {
    console.error("[API] Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

