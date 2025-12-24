
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const analyzeDocument = async (fileData: string, mimeType: string, fileName: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are VERITY, an Academic Integrity Analysis System.
    Identify: doc type, word count, integrity risk (Low/Medium/High), concise justification, similarity flags, AI markers, citation gaps.
    Output MUST be strictly JSON. 
    Be extremely concise. 
    Prioritize speed. 
    No technical jargon.
  `;

  const prompt = `Analyze file: "${fileName}". Return structured integrity report.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: fileData,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction,
        // Disable thinking for fastest possible response time as per user request
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentType: { type: Type.STRING },
            wordCount: { type: Type.STRING },
            overallRisk: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            justification: { type: Type.STRING },
            similarityRisk: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                phrases: { type: Type.ARRAY, items: { type: Type.STRING } },
                reasoning: { type: Type.STRING }
              },
              required: ['level', 'phrases', 'reasoning']
            },
            aiRisk: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                details: { type: Type.STRING }
              },
              required: ['level', 'details']
            },
            citations: {
              type: Type.OBJECT,
              properties: {
                missing: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['missing', 'suggestions']
            },
            consistency: {
              type: Type.OBJECT,
              properties: {
                notes: { type: Type.STRING },
                flags: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['notes', 'flags']
            },
            improvement: { type: Type.ARRAY, items: { type: Type.STRING } },
            rewrite: { type: Type.STRING }
          },
          required: [
            'documentType', 'wordCount', 'overallRisk', 'justification', 
            'similarityRisk', 'aiRisk', 'citations', 'consistency', 
            'improvement'
          ]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};
