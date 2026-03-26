// App.tsx
// Layout skeleton — Antigravity bu dosyayı UI tasarımıyla dolduracak.
// Mimari sabit kalacak: üstte render alanı, altta sticky input bar.

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import JsonRenderer from './components/JsonRenderer';
import { DoraemonResponse } from './utils/mockRespond';
import { claudeRespond } from './utils/claudeRespond';

export default function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<DoraemonResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setInput('');
    try {
      const result = await claudeRespond(input);
      setResponse(result);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      {/* Header tasarımı — Aydınlık Doraemon temalı */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎒 Ceren Pocket Doraemon</Text>
        <Text style={styles.headerSub}>Cebi aç, ne lazımsa çıkar</Text>
      </View>

      {/* Render alanı */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#0096ff" />
            <Text style={styles.emptyText}>Cebime bakıyorum...</Text>
          </View>
        ) : response ? (
          <JsonRenderer response={response} />
        ) : (
          <View style={styles.emptyState}>
            <Image 
              source={require('../assets/dora.jpeg')}
              style={styles.emptyImage} 
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>Sihirli Cebim Açık!</Text>
            <Text style={styles.emptyText}>Bana bir şey sor, hazır bekliyorum.</Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky input bar — Aydınlık, yuvarlatılmış tema */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputBarContainer}
      >
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Bugün ne lazım?"
            placeholderTextColor="#88929b"
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0096ff', // Match header color for top safe area
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#0096ff', // Doraemon blue
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 14,
    color: '#e6f2ff',
    marginTop: 4,
    fontWeight: '500',
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Soft sky blue
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 24,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0096ff',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#555555',
  },
  inputBarContainer: {
    backgroundColor: '#f0f8ff',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12, // extra padding for iOS home bar
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 14,
    color: '#333333',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 8,
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#e60012', // Collar Red
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e60012',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  sendIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
