// geminiRespond.ts
// Doraemon'un zekası — Gemini ile JSON gadget döndürür.
// mockRespond.ts fallback olarak kalır.

import { GoogleGenerativeAI } from '@google/generative-ai';
import { DoraemonResponse, mockRespond } from './mockRespond';

const SYSTEM_PROMPT = `Sen Doraemon'sun — kullanıcının kişisel AI asistanısın.
Kullanıcının mesajını analiz et ve hayatına en uygun gadget'ı seç.

SADECE aşağıdaki 3 JSON tipinden birini döndür. Başka HİÇBİR şey yazma — sadece ham JSON:

1. Görev/plan/yapılacaklar için:
{"type":"task_list","title":"başlık","items":["madde1","madde2","madde3"]}

2. Motivasyon/moral/ilham için:
{"type":"motivation","quote":"alıntı metni","author":"Doraemon"}

3. Odak/konsantrasyon/çalışma için:
{"type":"focus_card","title":"başlık","duration_min":25,"steps":["adım1","adım2","adım3","adım4"]}

Sadece JSON döndür. Türkçe içerik üret.`;

export async function geminiRespond(input: string): Promise<DoraemonResponse> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;

  if (!apiKey) {
    console.warn('[geminiRespond] API key yok, mock fallback');
    return mockRespond(input);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(input);
    const text = result.response.text().trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '');

    const parsed = JSON.parse(text) as DoraemonResponse;
    return parsed;
  } catch (err) {
    console.warn('[geminiRespond] Hata, mock fallback:', err);
    return mockRespond(input);
  }
}
