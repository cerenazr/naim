// JsonRenderer.tsx
// Doraemon'un cebinden çıkan gadget'ı render eder.
// type'a göre farklı component gösterir — UI Antigravity tarafından doldurulacak.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DoraemonResponse } from '../utils/mockRespond';

type Props = {
  response: DoraemonResponse | null;
};

export default function JsonRenderer({ response }: Props) {
  if (!response) return null;

  switch (response.type) {
    case 'task_list':
      return (
        <View style={styles.card}>
          {/* TODO (Antigravity): task_list UI — başlık + checkbox listesi */}
          <Text style={styles.title}>{response.title}</Text>
          {response.items.map((item, i) => (
            <Text key={i} style={styles.item}>• {item}</Text>
          ))}
        </View>
      );

    case 'motivation':
      return (
        <View style={styles.card}>
          {/* TODO (Antigravity): motivation UI — büyük quote, author, doraemon görseli */}
          <Text style={styles.quote}>"{response.quote}"</Text>
          {response.author && (
            <Text style={styles.author}>— {response.author}</Text>
          )}
        </View>
      );

    case 'focus_card':
      return (
        <View style={styles.card}>
          {/* TODO (Antigravity): focus_card UI — zamanlayıcı hissi, adım adım liste */}
          <Text style={styles.title}>{response.title}</Text>
          <Text style={styles.duration}>⏱ {response.duration_min} dakika</Text>
          {response.steps.map((step, i) => (
            <Text key={i} style={styles.item}>{i + 1}. {step}</Text>
          ))}
        </View>
      );

    default:
      // Yeni type geldiğinde burası genişler — self-improving loop
      return (
        <View style={styles.card}>
          <Text style={styles.title}>Yeni gadget keşfedildi 🎒</Text>
          <Text style={styles.item}>{JSON.stringify(response, null, 2)}</Text>
        </View>
      );
  }
}

// Temel stiller — Antigravity bunları Doraemon temasıyla değiştirecek
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#e94560',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccd6f6',
    marginBottom: 12,
  },
  item: {
    fontSize: 14,
    color: '#a8b2d8',
    marginVertical: 4,
    lineHeight: 20,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#ccd6f6',
    lineHeight: 28,
    marginBottom: 12,
  },
  author: {
    fontSize: 14,
    color: '#e94560',
    textAlign: 'right',
  },
  duration: {
    fontSize: 14,
    color: '#e94560',
    marginBottom: 12,
    fontWeight: 'bold',
  },
});
