# Antigravity UI Brief — Ceren Pocket Doraemon

> Bu döküman Claude Code'dan Antigravity MCP'ye handoff'tur.
> Mimari hazır, mantık çalışıyor. Senin görevin: görsel tasarımı Doraemon temasıyla implement etmek.

---

## Proje Özeti

**App:** Doraemon temalı kişisel AI asistan
**Stack:** Expo React Native + TypeScript
**Tema:** Koyu arka plan (`#1a1a2e`), kırmızı accent (`#e94560`), mavi tonlar
**Hedef:** Kullanıcı input yazar → AI JSON döner → App render eder

---

## Dosya Yapısı

```
app/
├── App.tsx                    ← Ana layout (GÜNCELLEYEBİLİRSİN)
├── components/
│   └── JsonRenderer.tsx       ← Her gadget tipi buradan render edilir (GÜNCELLEYEBİLİRSİN)
└── utils/
    └── mockRespond.ts         ← JSON logic (DOKUNMA — sadece mimari)
```

---

## JSON Şema Tipleri (3 gadget)

### 1. `task_list`
```json
{
  "type": "task_list",
  "title": "Bugün yapılacaklar",
  "items": ["İlk adımı at 🎒", "Odaklan, Nobita!", "Projeyi ilerlet"]
}
```
**UI isteği:** Checkbox listesi hissi, her item yanında küçük Doraemon ikonu veya renkli bullet.

---

### 2. `motivation`
```json
{
  "type": "motivation",
  "quote": "Düşme korkusu, uçma hayalinden büyük olmamalı.",
  "author": "Doraemon"
}
```
**UI isteği:** Büyük italik quote metni, altında author. Arka planda subtle gradient. Belki assets/dora.jpeg kullanılabilir.

---

### 3. `focus_card`
```json
{
  "type": "focus_card",
  "title": "Odak Modu",
  "duration_min": 25,
  "steps": ["Telefonu kapat", "Hedefini yaz", "25 dakika çalış", "Mola ver"]
}
```
**UI isteği:** Büyük sayaç/timer hissi, adımlar numaralı liste olarak. Kırmızı zamanlayıcı rengi.

---

## Layout Yapısı (App.tsx)

```
┌─────────────────────────┐
│  Header: başlık + sub   │  ← Doraemon temasıyla güzelleştir
├─────────────────────────┤
│                         │
│   ScrollView            │  ← JsonRenderer burada
│   (response veya        │
│    empty state)         │  ← Boş state: Doraemon bekleme animasyonu/görseli
│                         │
├─────────────────────────┤
│  [   input   ] [➤]      │  ← Sticky input bar, rounded, koyu arka plan
└─────────────────────────┘
```

---

## Renk Paleti (mevcut — değiştirebilirsin)

| Token | Renk | Kullanım |
|-------|------|---------|
| background | `#1a1a2e` | Ana arka plan |
| surface | `#16213e` | Card, input arka planı |
| accent | `#e94560` | Buton, border, vurgu |
| text-primary | `#ccd6f6` | Ana metin |
| text-secondary | `#a8b2d8` | İkincil metin |
| text-muted | `#4a4a6a` | Placeholder |

---

## Varlıklar

- `assets/dora.jpeg` — Doraemon görseli, motivation card'da veya boş state'de kullanılabilir

---

## Notlar

- `mockRespond.ts` dosyasına **dokunma** — bu dosya ileride Claude API ile değiştirilecek
- `JsonRenderer.tsx` içindeki `// TODO (Antigravity):` yorumlarını implement et
- Yeni component ekleme — bunu Claude Code ile koordineli yap (self-improving loop parçası)
