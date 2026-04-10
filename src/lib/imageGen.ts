import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAgroTechImages() {
  // Generate Hero Grid Image
  const heroResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: 'A professional grid of 9 square portraits of diverse young Nigerian agro-tech professionals. Each person is smiling, tech-forward, some holding tablets or wearing smart farming gear. High quality professional photography, clean studio backgrounds with subtle green accents. The overall look is modern, energetic, and professional like a high-end education platform.',
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  // Generate Footer Background
  const footerResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: 'A cinematic wide shot of a group of young Nigerian men and women in a modern lush green farm. They are using tablets and drones to monitor crops. Golden hour sunset lighting, high quality, professional photography. The image should be wide and suitable for a background overlay.',
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  let heroImage = "";
  let footerImage = "";

  for (const part of heroResponse.candidates[0].content.parts) {
    if (part.inlineData) {
      heroImage = `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  for (const part of footerResponse.candidates[0].content.parts) {
    if (part.inlineData) {
      footerImage = `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  return { heroImage, footerImage };
}
