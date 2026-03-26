import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.emoji}>🎒</Text>
        <Text style={styles.title}>Ceren Pocket Doraemon</Text>
        <Text style={styles.subtitle}>Görevlerini Cebinden Çıkar</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Her görevi zamanında tamamla, cebindeki araçlarla hayatını kolaylaştır.
        </Text>
      </View>
      <Text style={styles.badge}>⚡ NAIM Challenge — Iteration 1</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a8b2d8',
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#e94560',
  },
  cardText: {
    fontSize: 15,
    color: '#ccd6f6',
    lineHeight: 22,
    textAlign: 'center',
  },
  badge: {
    fontSize: 12,
    color: '#4a4a6a',
    letterSpacing: 0.5,
  },
});
