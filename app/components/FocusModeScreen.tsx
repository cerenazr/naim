import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';

type Step = { id: number; label: string; icon: string };

const focusSteps: Step[] = [
  { id: 1, label: 'Telefonu kapat', icon: 'smartphone' },
  { id: 2, label: 'Hedefini yaz', icon: 'edit-note' },
  { id: 3, label: '25 dakika çalış', icon: 'timer' },
  { id: 4, label: 'Mola ver', icon: 'coffee' },
];

const POMODORO_SECONDS = 25 * 60;

export default function FocusModeScreen() {
  const [seconds, setSeconds] = useState(POMODORO_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      glowAnim.stopAnimation();
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const handleReset = () => {
    setRunning(false);
    setSeconds(POMODORO_SECONDS);
  };

  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.4] });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiq6dncJyAjsXBoGlwK5EBIIUho62GJPd0n7c1WiSRMNr6nPDpFtclB7mYWvLDHRN05aXfzFEA8upo1Qj41VTpknfkSuECBUtOXX8fbYwbyM1EBA1EbdeiDFwjRkr_Lkfe4pXY7SzKI7HRz6dzmzXy_Nw3TnET6YPT5gu5VS0Al-rYdt8FqWE371J9vFTKHMzCkg0UrMYXwFVVxE0irjW7CQyIpdnOe426tun5mP2LQjFMiH0Xied7yuJ_ZzYG78t-FASNywLjimA' }}
              style={styles.avatarImage}
            />
          </View>
          <Text style={styles.headerTitle}>4D Assistant</Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="notifications-none" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Focus Mode Header */}
        <View style={styles.focusHeader}>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>AKTİF OTURUM</Text>
          </View>
          <Text style={styles.focusTitle}>Odak Modu</Text>
          <Text style={styles.focusSubtitle}>Geleceği inşa etmek için şimdiye odaklanma vakti.</Text>
        </View>

        {/* Timer Widget */}
        <View style={styles.timerCard}>
          {/* Bell decoration */}
          <View style={styles.bellDecor}>
            <MaterialIcons name="notifications-active" size={28} color={theme.colors.on_tertiary_fixed} />
          </View>

          {/* Glow background when running */}
          <Animated.View style={[styles.timerGlow, { opacity: glowOpacity }]} />

          <View style={styles.timerBody}>
            <Text style={styles.timerText}>{minutes}:{secs}</Text>
            <View style={styles.timerControls}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => setRunning(r => !r)}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name={running ? 'pause' : 'play-arrow'}
                  size={28}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
                activeOpacity={0.8}
              >
                <MaterialIcons name="refresh" size={28} color={theme.colors.on_surface_variant} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Focus Steps Checklist */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>ODAKLANMA ADIMLARI</Text>
          <View style={styles.stepsList}>
            {focusSteps.map(step => (
              <View key={step.id} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.id}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepLabel}>{step.label}</Text>
                  <MaterialIcons name={step.icon as any} size={22} color={theme.colors.primary_container} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Encouraging Quote */}
        <View style={styles.quoteBar}>
          <View style={styles.quoteBarAccent} />
          <Text style={styles.quoteBarText} numberOfLines={3}>
            "Hatalar yapmak, hiçbir şey yapmamaktan çok daha iyidir. Hadi başlayalım!"
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Input Bar */}
      <View style={styles.bottomInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ne üzerine odaklanıyorsun?"
          placeholderTextColor={theme.colors.outline}
        />
        <TouchableOpacity style={styles.sendButton}>
          <MaterialIcons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface_container_low,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 40 },
    shadowOpacity: 0.06,
    shadowRadius: 60,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: theme.colors.primary_container,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontFamily: theme.fonts.headlineBlack,
    fontSize: 20,
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 160,
    gap: 24,
  },
  focusHeader: {
    alignItems: 'center',
    gap: 8,
  },
  activeBadge: {
    backgroundColor: 'rgba(212, 166, 0, 0.2)',
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  activeBadgeText: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 10,
    letterSpacing: 2,
    color: theme.colors.tertiary,
    textTransform: 'uppercase',
  },
  focusTitle: {
    fontFamily: theme.fonts.headlineBlack,
    fontSize: 32,
    color: theme.colors.on_surface,
  },
  focusSubtitle: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 14,
    color: theme.colors.on_surface_variant,
    textAlign: 'center',
    maxWidth: 260,
  },
  timerCard: {
    backgroundColor: theme.colors.surface_container_lowest,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.05,
    shadowRadius: 50,
    elevation: 8,
    borderBottomWidth: 8,
    borderBottomColor: 'rgba(0, 150, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  bellDecor: {
    position: 'absolute',
    top: -22,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.tertiary_fixed,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.tertiary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 4,
    borderColor: '#fff',
    zIndex: 10,
  },
  timerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.secondary_container,
    borderRadius: 24,
  },
  timerBody: {
    alignItems: 'center',
    marginTop: 32,
  },
  timerText: {
    fontFamily: theme.fonts.headlineBlack,
    fontSize: 80,
    lineHeight: 88,
    color: theme.colors.secondary,
    letterSpacing: -4,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  resetButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.surface_container_high,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsCard: {
    backgroundColor: theme.colors.surface_container_low,
    borderRadius: 24,
    padding: 24,
    gap: 20,
  },
  stepsTitle: {
    fontFamily: theme.fonts.labelBold,
    fontSize: 11,
    letterSpacing: 2,
    color: theme.colors.primary,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface_container_lowest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    flexShrink: 0,
  },
  stepNumberText: {
    fontFamily: theme.fonts.headlineBlack,
    fontSize: 15,
    color: theme.colors.primary,
  },
  stepContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  stepLabel: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 15,
    color: theme.colors.on_surface,
  },
  quoteBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(208, 166, 0, 0.10)',
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: 16,
    paddingRight: 16,
  },
  quoteBarAccent: {
    width: 4,
    borderRadius: 4,
    backgroundColor: theme.colors.tertiary,
    marginHorizontal: 16,
    alignSelf: 'stretch',
  },
  quoteBarText: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 14,
    fontStyle: 'italic',
    color: theme.colors.on_surface_variant,
    lineHeight: 22,
    flex: 1,
  },
  bottomInputContainer: {
    position: 'absolute',
    bottom: 90,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 99,
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 97, 167, 0.05)',
  },
  textInput: {
    flex: 1,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 14,
    color: theme.colors.on_surface,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
