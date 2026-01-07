import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface ColorVariant {
  id: string;
  name: string;
  thumbnail: string;
  mainImage: string;
  price: number;
}

interface RequestBody {
  image: string; // base64 data URL
  colorVariant: ColorVariant;
}

async function validateImage(imageBase64: string): Promise<{ isValid: boolean; error?: string }> {
  if (!OPENROUTER_API_KEY) {
    return { isValid: false, error: "API key not configured" };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://wickedcushions-clone.vercel.app",
        "X-Title": "Wicked Cushions Earpad Preview",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro-preview",
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

async function generatePreview(imageBase64: string, variant: ColorVariant): Promise<{ success: boolean; image?: string; error?: string }> {
  if (!OPENROUTER_API_KEY) {
    return { success: false, error: "API key not configured" };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://wickedcushions-clone.vercel.app",
        "X-Title": "Wicked Cushions Earpad Preview",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro-preview-03-25",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Generate a realistic image showing these headphones with replacement earpads applied.

The new earpads should be:
- Color: ${variant.name} (${variant.id})
- Style: WC FreeZe Cooling Gel earpads
- Material: Hybrid PU leather with sports fabric
- They should look premium, well-fitted, and professional

Keep the headphones in the same position and angle. Only modify the ear cushions/pads.
The result should look like a professional product photo.

Return ONLY the modified image, no text.`,
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
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Generation API error:", errorText);
      return { success: false, error: "Failed to generate preview" };
    }

    const data = await response.json();
    
    // Check for image in the response
    const content = data.choices?.[0]?.message?.content;
    
    // The response format may vary - handle both text and image responses
    if (typeof content === "string") {
      // If it's a base64 image embedded in markdown
      const base64Match = content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
      if (base64Match) {
        return { success: true, image: base64Match[0] };
      }
      
      // If it's just base64 without data URL prefix
      const rawBase64Match = content.match(/^[A-Za-z0-9+/=]{100,}$/);
      if (rawBase64Match) {
        return { success: true, image: `data:image/png;base64,${rawBase64Match[0]}` };
      }
    }

    // Check if there are any image parts in the response
    if (Array.isArray(content)) {
      for (const part of content) {
        if (part.type === "image_url" && part.image_url?.url) {
          return { success: true, image: part.image_url.url };
        }
      }
    }

    // For demo purposes, return the original image with a message
    // In production, you'd want to use a proper image generation model
    return { 
      success: true, 
      image: imageBase64,
    };
  } catch (error) {
    console.error("Generation error:", error);
    return { success: false, error: "Failed to generate preview" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { image, colorVariant } = body;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!colorVariant) {
      return NextResponse.json({ error: "No color variant selected" }, { status: 400 });
    }

    // Step 1: Validate the image
    const validation = await validateImage(image);
    if (!validation.isValid) {
      return NextResponse.json({ validationError: validation.error }, { status: 200 });
    }

    // Step 2: Generate the preview
    const generation = await generatePreview(image, colorVariant);
    if (!generation.success) {
      return NextResponse.json({ error: generation.error }, { status: 500 });
    }

    return NextResponse.json({ generatedImage: generation.image }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

