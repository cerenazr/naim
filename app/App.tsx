// App.tsx
// Layout skeleton — Antigravity bu dosyayı UI tasarımıyla dolduracak.
// Mimari sabit kalacak: üstte render alanı, altta sticky input bar.

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import JsonRenderer from './components/JsonRenderer';
import { mockRespond, DoraemonResponse } from './utils/mockRespond';

export default function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<DoraemonResponse | null>(null);

  function handleSend() {
    if (!input.trim()) return;
    const result = mockRespond(input);
    setResponse(result);
    setInput('');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      {/* TODO (Antigravity): header tasarımı — Doraemon temalı */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎒 Ceren Pocket Doraemon</Text>
        <Text style={styles.headerSub}>Cebi aç, ne lazımsa çıkar</Text>
      </View>

      {/* Render alanı — JSON response buraya gelir */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {response ? (
          <JsonRenderer response={response} />
        ) : (
          /* TODO (Antigravity): boş state tasarımı — Doraemon bekleme animasyonu */
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🤖</Text>
            <Text style={styles.emptyText}>Cebime bir şey sor...</Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky input bar — TODO (Antigravity): tasarımı güzelleştir */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputBar}
      >
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Bugün ne lazım?"
          placeholderTextColor="#4a4a6a"
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e94560',
  },
  headerSub: {
    fontSize: 12,
    color: '#4a4a6a',
    marginTop: 2,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#4a4a6a',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#16213e',
    backgroundColor: '#1a1a2e',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#ccd6f6',
    fontSize: 15,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#e94560',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    color: '#fff',
    fontSize: 16,
  },
});
