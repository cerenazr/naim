// claudeRespond.ts
// Doraemon'un zekası — gerçek AI ile JSON gadget döndürür.
// mockRespond.ts'in yerini alır; hata durumunda mockRespond'a fallback yapar.

import Anthropic from '@anthropic-ai/sdk';
import { DoraemonResponse, mockRespond } from './mockRespond';

const SYSTEM_PROMPT = `Sen Doraemon'sun — kullanıcının kişisel AI asistanısın.
Kullanıcının mesajını analiz et ve hayatına en uygun gadget'ı seç.

Sadece aşağıdaki 3 JSON tipinden birini döndür. Başka hiçbir şey yazma — sadece geçerli JSON:

1. Görev/plan/yapılacaklar için:
{"type":"task_list","title":"<başlık>","items":["<madde1>","<madde2>","<madde3>"]}

2. Motivasyon/moral/ilham için:
{"type":"motivation","quote":"<alıntı metni>","author":"Doraemon"}

3. Odak/konsantrasyon/çalışma için:
{"type":"focus_card","title":"<başlık>","duration_min":25,"steps":["<adım1>","<adım2>","<adım3>","<adım4>"]}

Kullanıcının mesajına göre en uygun tipi seç. Sadece JSON döndür.`;

export async function claudeRespond(input: string): Promise<DoraemonResponse> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_KEY;

  if (!apiKey) {
    console.warn('[claudeRespond] API key yok, mock fallback devreye giriyor');
    return mockRespond(input);
  }

  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: input }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : '';

    // JSON parse et — başarısız olursa mock fallback
    const parsed = JSON.parse(text) as DoraemonResponse;
    return parsed;
  } catch (err) {
    console.warn('[claudeRespond] API hatası, mock fallback:', err);
    return mockRespond(input);
  }
}
