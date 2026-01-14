import { GoogleGenAI } from "@google/genai";
import { UploadedFile, CharacterProfile, ModelStyle } from "../types";

const MODEL_NAME = 'gemini-3-pro-image-preview';

export const generateComposite = async (
  faceImage: UploadedFile,
  refImage: UploadedFile | null,
  characterProfile: CharacterProfile | null,
  _modelStyle?: ModelStyle | null, // Not used in Gemini, but kept for API compatibility
  _faceImage2?: UploadedFile | null // Not used in Gemini, but kept for API compatibility
): Promise<string> => {

  if (window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct parts based on inputs
  const parts: any[] = [];

  // 1. Face (Always present)
  parts.push({
    inlineData: {
      mimeType: faceImage.mimeType,
      data: faceImage.base64!,
    },
  });

  // 2. Reference Body (Image OR Text Description)
  let descriptionPrompt = "";

  if (refImage && refImage.base64) {
    // User uploaded a custom 3D model ref
    parts.push({
      inlineData: {
        mimeType: refImage.mimeType,
        data: refImage.base64,
      },
    });
    descriptionPrompt = `
      I have provided two images.
      Image 1: A personal photo of a human face (Identity Source).
      Image 2: A 3D model reference (Body/Pose/Style Source).
      
      TASK: Create a 3D Render/Chibi style image.
      1. Graft the FACE from Image 1 onto the BODY of Image 2.
      2. Keep the exact pose, clothing, and lighting of Image 2.
      3. Ensure the face matches the 3D art style (smooth skin, slightly stylized features) but retains the person's identity.
    `;
  } else if (characterProfile) {
    // User selected a preset character (Use Text to guide Generation)
    descriptionPrompt = `
      I have provided one image (Image 1) which is a personal photo of a human face.
      
      TASK: Transform this person into a specific character based on this description:
      "${characterProfile.visualPrompt}"
      
      REQUIREMENTS:
      1. STYLE: High-fidelity 3D Render (Pixar/Disney/Chibi aesthetic). Cute proportions but detailed textures.
      2. IDENTITY: Use the facial features (eyes, nose, mouth structure) from Image 1, but stylize them to fit the 3D Chibi world.
      3. OUTFIT: Must match the description exactly (Armor, colors, weapons).
      4. BACKGROUND: Clean studio lighting or simple atmospheric background matching the theme.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [...parts, { text: descriptionPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4", // Portrait for character cards
          imageSize: "1K",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated.");
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    if (error.message && error.message.includes("Requested entity was not found")) {
      if (window.aistudio) await window.aistudio.openSelectKey();
    }
    throw error;
  }
};