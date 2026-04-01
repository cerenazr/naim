// DoraemonHub.tsx — 3 mod: Sor | Öner | Belgele
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { geminiRespond } from '../utils/geminiRespond';
import { geminiRaw } from '../utils/geminiRaw';
import { DoraemonResponse } from '../utils/mockRespond';

const CURRENT_FEATURES = [
  'Tek ekran başlık ve Doraemon teması',
  'Renk şeması — Hybrid Light/Dark (Antigravity ile yapıldı, Score: 95)',
  'Text input → Gemini 2.0 Flash AI JSON response (task_list | motivation | focus_card)',
  'Doraemon Hub — floating button + modal (self-improving loop)',
  'Todo CRUD — ekleme, düzenleme (uzun bas), silme (× ikonu)',
  'Local storage — todo\'lar uygulama kapansa da telefonda kalır',
];

const HUB_SYSTEM_CONTEXT = `Kullanıcı senden uygulamaya yeni bir özellik veya içerik eklemeni istiyor.
Mevcut gadget tipleri: task_list, motivation, focus_card.
Eğer bilinen bir tip uygunsa onu döndür.
Eğer tamamen yeni bir şey istiyorsa, en yakın tipi kullanarak zengin bir içerik döndür.`;

type Mode = 'chat' | 'suggest' | 'docs';

type Props = {
  onNewResponse: (response: DoraemonResponse) => void;
};

export default function DoraemonHub({ onNewResponse }: Props) {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>('chat');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [docs, setDocs] = useState('');

  async function handleHubSend() {
    if (!input.trim() || loading) return;
    const req = input.trim();
    setLastRequest(req);
    setInput('');
    setLoading(true);
    try {
      const result = await geminiRespond(HUB_SYSTEM_CONTEXT + '\n\nKullanıcı isteği: ' + req);
      onNewResponse(result);
      setVisible(false);
    } catch {
      // mock fallback devreye girer
    } finally {
      setLoading(false);
    }
  }

  async function handleSuggest() {
    if (loading) return;
    setSuggestion('');
    setLoading(true);
    try {
      const featureList = CURRENT_FEATURES.map((f, i) => `${i + 1}. ${f}`).join('\n');
      const prompt = `Bu bir React Native Expo uygulaması. Şu anda şu özellikler mevcut:\n${featureList}\n\nBu "self-improving app" konseptine göre geliştirilmekte. Sıradaki en değerli 1 özelliği Türkçe olarak öner. Neden önemli olduğunu ve nasıl uygulanacağını 3-4 cümleyle açıkla.`;
      const result = await geminiRaw(prompt);
      setSuggestion(result);
    } catch {
      setSuggestion('Gemini bağlantısı kurulamadı. API key kontrol et.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDocs() {
    if (loading) return;
    setDocs('');
    setLoading(true);
    try {
      const featureList = CURRENT_FEATURES.map((f, i) => `${i + 1}. ${f}`).join('\n');
      const prompt = `Aşağıdaki özelliklere sahip "Ceren Pocket Doraemon" adlı bir React Native uygulaması var:\n${featureList}\n\nBu uygulamanın profesyonel kısa bir dokümantasyonunu Türkçe yaz. Her özelliği 1 cümleyle açıkla. Başlık: "Uygulama Dokümantasyonu". Sade ve okunabilir olsun.`;
      const result = await geminiRaw(prompt);
      setDocs(result);
    } catch {
      setDocs('Gemini bağlantısı kurulamadı. API key kontrol et.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TouchableOpacity style={styles.fab} onPress={() => setVisible(true)} activeOpacity={0.8}>
        <Text style={styles.fabEmoji}>🎒</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setVisible(false)} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheet}>
          <View style={styles.handle} />

          {/* Tab bar */}
          <View style={styles.tabs}>
            {(['chat', 'suggest', 'docs'] as Mode[]).map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.tab, mode === m && styles.tabActive]}
                onPress={() => setMode(m)}
              >
                <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
                  {m === 'chat' ? '💬 Sor' : m === 'suggest' ? '🤖 Öner' : '📄 Belgele'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CHAT MODE */}
          {mode === 'chat' && (
            <>
              <Text style={styles.hubTitle}>🎒 Doraemon'a Sor</Text>
              <Text style={styles.hubSub}>Uygulamaya ne eklememi istersin?</Text>
              {lastRequest && !loading && (
                <View style={styles.lastBubble}>
                  <Text style={styles.lastText}>"{lastRequest}" → güncellendi ✓</Text>
                </View>
              )}
              {loading && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#0096ff" />
                  <Text style={styles.loadingText}>Cebime bakıyorum...</Text>
                </View>
              )}
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={input}
                  onChangeText={setInput}
                  placeholder="örn: Haftalık planlayıcı ekle"
                  placeholderTextColor="#88929b"
                  onSubmitEditing={handleHubSend}
                  returnKeyType="send"
                  autoFocus
                />
                <TouchableOpacity
                  style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
                  onPress={handleHubSend}
                  disabled={loading}
                >
                  <Text style={styles.sendIcon}>➤</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* SUGGEST MODE */}
          {mode === 'suggest' && (
            <>
              <Text style={styles.hubTitle}>🤖 Sıradaki Özelliği Öner</Text>
              <Text style={styles.hubSub}>Gemini mevcut duruma bakıp ne eklemeli söyler.</Text>
              {loading && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#7c3aed" />
                  <Text style={[styles.loadingText, { color: '#7c3aed' }]}>Analiz ediyorum...</Text>
                </View>
              )}
              {suggestion ? (
                <ScrollView style={styles.resultBox} showsVerticalScrollIndicator={false}>
                  <Text style={styles.resultText}>{suggestion}</Text>
                </ScrollView>
              ) : null}
              {!loading && (
                <TouchableOpacity style={[styles.sendBtn, styles.actionBtn]} onPress={handleSuggest}>
                  <Text style={styles.actionBtnText}>🤖 Öner!</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* DOCS MODE */}
          {mode === 'docs' && (
            <>
              <Text style={styles.hubTitle}>📄 Kendini Belgele</Text>
              <Text style={styles.hubSub}>Uygulama kendi dokümantasyonunu yazar.</Text>
              {loading && (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#0d9488" />
                  <Text style={[styles.loadingText, { color: '#0d9488' }]}>Yazıyorum...</Text>
                </View>
              )}
              {docs ? (
                <ScrollView style={styles.resultBox} showsVerticalScrollIndicator={false}>
                  <Text style={styles.resultText}>{docs}</Text>
                </ScrollView>
              ) : null}
              {!loading && (
                <TouchableOpacity style={[styles.sendBtn, styles.actionBtn, { backgroundColor: '#0d9488' }]} onPress={handleDocs}>
                  <Text style={styles.actionBtnText}>📄 Belgele!</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0096ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#0096ff',
    zIndex: 100,
  },
  fabEmoji: { fontSize: 26 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '80%',
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },
  tabTextActive: { color: '#0f172a' },
  hubTitle: { fontSize: 20, fontWeight: '900', color: '#0096ff', marginBottom: 4 },
  hubSub: { fontSize: 13, color: '#88929b', marginBottom: 16 },
  lastBubble: {
    backgroundColor: '#f0fff4', borderRadius: 12, padding: 10,
    marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#34c759',
  },
  lastText: { fontSize: 13, color: '#2e7d32' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  loadingText: { color: '#0096ff', fontSize: 14 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: {
    flex: 1, backgroundColor: '#f0f8ff', borderRadius: 24,
    paddingHorizontal: 18, paddingVertical: 12, fontSize: 15, color: '#333',
  },
  sendBtn: {
    backgroundColor: '#0096ff', width: 48, height: 48,
    borderRadius: 24, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#b0d4f1' },
  sendIcon: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resultBox: {
    backgroundColor: '#f8fafc', borderRadius: 16,
    padding: 16, marginBottom: 16, maxHeight: 200,
  },
  resultText: { fontSize: 14, color: '#334155', lineHeight: 22 },
  actionBtn: {
    width: '100%', height: 48, borderRadius: 16,
    backgroundColor: '#7c3aed',
  },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
