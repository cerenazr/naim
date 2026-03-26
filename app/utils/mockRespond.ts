// mockRespond.ts
// Kullanıcı inputunu analiz eder, uygun JSON gadget'ı döner.
// Bu "Doraemon'un cebi" — şimdi 3 gadget var, her iteration'da cep büyür.

export type TaskListResponse = {
  type: 'task_list';
  title: string;
  items: string[];
};

export type MotivationResponse = {
  type: 'motivation';
  quote: string;
  author?: string;
};

export type FocusCardResponse = {
  type: 'focus_card';
  title: string;
  duration_min: number;
  steps: string[];
};

// Gelecekte AI'dan gelecek — şimdi mock
export type DoraemonResponse =
  | TaskListResponse
  | MotivationResponse
  | FocusCardResponse;

const TASK_KEYWORDS = ['görev', 'yapacak', 'liste', 'bugün', 'plan', 'task', 'todo'];
const MOTIVATION_KEYWORDS = ['motivasyon', 'güç', 'cesaret', 'moral', 'ilham', 'motivate'];

export function mockRespond(input: string): DoraemonResponse {
  const lower = input.toLowerCase();

  if (TASK_KEYWORDS.some((kw) => lower.includes(kw))) {
    return {
      type: 'task_list',
      title: 'Bugün yapılacaklar',
      items: [
        'İlk adımı at 🎒',
        'Odaklan, Nobita!',
        'Projeyi ilerlet',
        'Mola ver, sonra devam',
      ],
    };
  }

  if (MOTIVATION_KEYWORDS.some((kw) => lower.includes(kw))) {
    return {
      type: 'motivation',
      quote: 'Düşme korkusu, uçma hayalinden büyük olmamalı.',
      author: 'Doraemon',
    };
  }

  // default: focus_card
  return {
    type: 'focus_card',
    title: 'Odak Modu',
    duration_min: 25,
    steps: [
      'Telefonu kapat',
      'Hedefini yaz',
      '25 dakika kesintisiz çalış',
      'Kısa mola ver',
    ],
  };
}
