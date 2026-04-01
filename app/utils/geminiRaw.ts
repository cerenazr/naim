import { GoogleGenerativeAI } from '@google/generative-ai';

export async function geminiRaw(prompt: string): Promise<string> {
  const API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY ?? '';
  if (!API_KEY) throw new Error('No Gemini key');
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
