// DoraemonHub.tsx
// Sağ alt köşede Doraemon icon — tıklayınca hub modal açılır.
// Kullanıcı "Haftalık planlayıcı ekle" gibi bir şey yazar →
// Gemini yeni JSON schema döner → ana ekran canlı güncellenir (self-improving loop).

import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { geminiRespond } from '../utils/geminiRespond';
import { DoraemonResponse } from '../utils/mockRespond';

const HUB_SYSTEM_CONTEXT = `Kullanıcı senden uygulamaya yeni bir özellik veya içerik eklemeni istiyor.
Mevcut gadget tipleri: task_list, motivation, focus_card.
Eğer bilinen bir tip uygunsa onu döndür.
Eğer tamamen yeni bir şey istiyorsa, en yakın tipi kullanarak zengin bir içerik döndür.`;

type Props = {
  onNewResponse: (response: DoraemonResponse) => void;
};

export default function DoraemonHub({ onNewResponse }: Props) {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState('');

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
      // fallback sessiz — mock zaten devreye girer
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Doraemon button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabEmoji}>🎒</Text>
      </TouchableOpacity>

      {/* Hub Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.sheet}
        >
          <View style={styles.handle} />

          <Text style={styles.hubTitle}>🎒 Doraemon'a Sor</Text>
          <Text style={styles.hubSub}>
            Uygulamaya ne eklememi istersin?
          </Text>

          {lastRequest && !loading ? (
            <View style={styles.lastBubble}>
              <Text style={styles.lastText}>"{lastRequest}" → güncellendi ✓</Text>
            </View>
          ) : null}

          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#0096ff" />
              <Text style={styles.loadingText}>Cebime bakıyorum...</Text>
            </View>
          ) : null}

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
  fabEmoji: {
    fontSize: 26,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  hubTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0096ff',
    marginBottom: 4,
  },
  hubSub: {
    fontSize: 14,
    color: '#88929b',
    marginBottom: 20,
  },
  lastBubble: {
    backgroundColor: '#f0fff4',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#34c759',
  },
  lastText: {
    fontSize: 13,
    color: '#2e7d32',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  loadingText: {
    color: '#0096ff',
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  sendBtn: {
    backgroundColor: '#0096ff',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#b0d4f1',
  },
  sendIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
