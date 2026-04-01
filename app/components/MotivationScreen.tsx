import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';

export default function MotivationScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPT8W2Tj15ryhBg8RfuEDRVtzrzCufNn6d8PQEDhALkywq3aKnuhrjIccmccMaU5776Rct6S8qQ2G8YYRTWtuKkNROhKs15Q2O3ZxzageEoYRo18UQm3mVqX9N2Y1Vjgl4ZmvowPpA633h7SECMc2DRtHLq7PaltW1cq3z5zpRnRCd8D9vJ2AEdoc8SGv8gcRVtZCyDyKJTzn-XwxL6p5WTWgEV_-uacpJU4wS-sv14ajPYFWpWt4Gw9KyfkZHaX4FIOsPHh-Y7W0' }} 
            style={styles.avatar} 
          />
          <Text style={styles.headerTitle}>Hello, Friend!</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="notifications-none" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Motivation Widget */}
        <View style={styles.motivationCard}>
          {/* Decorative shapes using absolute views */}
          <View style={styles.decorTopRight} />
          <View style={styles.decorBottomLeft} />
          
          <View style={styles.sparkRow}>
            <View style={styles.sparkDot} />
            <Text style={styles.sparkText}>DAILY SPARK</Text>
          </View>
          
          <Text style={styles.quoteText}>
            "Düşme korkusu, uçma hayalinden büyük olmamalı."
          </Text>
          
          <View style={styles.authorRow}>
            <View style={styles.authorLine} />
            <Text style={styles.authorText}>— Doraemon</Text>
            <View style={styles.bellIconContainer}>
              <MaterialIcons name="notifications-active" size={16} color={theme.colors.on_tertiary_container} />
            </View>
          </View>
        </View>

        {/* Bento Grid */}
        <View style={styles.bentoGrid}>
          <TouchableOpacity style={styles.bentoItemLight}>
            <View style={styles.bentoIconLight}>
              <MaterialIcons name="auto-fix-high" size={24} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.bentoTitleLight}>Gadgets</Text>
              <Text style={styles.bentoSubtitleLight}>Check your inventory</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.bentoItemLight, styles.bentoItemDark]}>
            <View style={styles.bentoIconDark}>
              <MaterialIcons name="explore" size={24} color={theme.colors.surface_container_lowest} />
            </View>
            <View>
              <Text style={styles.bentoTitleDark}>Anywhere Door</Text>
              <Text style={styles.bentoSubtitleDark}>Plan your next trip</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Message Card (Glassmorphism alternative) */}
        <View style={styles.messageCard}>
          <View style={styles.messageIconContainer}>
            <MaterialIcons name="notifications" size={24} color={theme.colors.surface_container_lowest} />
          </View>
          <View style={styles.messageTextContainer}>
            <Text style={styles.messageTitle}>Reminder from the Future</Text>
            <Text style={styles.messageBody}>Your "Translation Gummy" project is due in 2 hours. Want me to draft the outline for you?</Text>
          </View>
        </View>

      </ScrollView>

      {/* Sticky Bottom Input */}
      <View style={styles.bottomInputContainer}>
        <TextInput 
          style={styles.textInput} 
          placeholder="What can I help you with today?"
          placeholderTextColor={theme.colors.outline}
        />
        <TouchableOpacity style={styles.sendButton}>
          <MaterialIcons name="send" size={20} color={theme.colors.surface_container_lowest} />
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
    backgroundColor: theme.colors.surface,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary_container,
  },
  headerTitle: {
    fontFamily: theme.fonts.headlineBlack,
    fontSize: 20,
    color: theme.colors.primary,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 160,
  },
  motivationCard: {
    backgroundColor: theme.colors.surface_container_lowest,
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  decorTopRight: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.colors.primary_container,
    opacity: 0.1,
  },
  decorBottomLeft: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.tertiary_container,
    opacity: 0.2,
  },
  sparkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sparkDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.secondary,
  },
  sparkText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: theme.colors.on_surface_variant,
  },
  quoteText: {
    fontFamily: theme.fonts.headlineBlack,
    fontSize: 28,
    lineHeight: 36,
    color: theme.colors.primary,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  authorLine: {
    height: 2,
    width: 32,
    backgroundColor: theme.colors.tertiary_container,
  },
  authorText: {
    fontFamily: theme.fonts.bodyBold,
    color: theme.colors.on_surface_variant,
  },
  bellIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.tertiary_container,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  bentoItemLight: {
    flex: 1,
    backgroundColor: theme.colors.surface_container_low,
    borderRadius: 24,
    padding: 24,
    aspectRatio: 1,
    justifyContent: 'space-between',
  },
  bentoIconLight: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface_container_lowest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bentoTitleLight: {
    fontFamily: theme.fonts.headlineBlack,
    color: theme.colors.on_surface,
    fontSize: 16,
    marginTop: 12,
  },
  bentoSubtitleLight: {
    fontFamily: theme.fonts.bodyMedium,
    color: theme.colors.on_surface_variant,
    fontSize: 12,
    marginTop: 4,
  },
  bentoItemDark: {
    backgroundColor: theme.colors.primary_container,
  },
  bentoIconDark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoTitleDark: {
    fontFamily: theme.fonts.headlineBlack,
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
  },
  bentoSubtitleDark: {
    fontFamily: theme.fonts.bodyMedium,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  messageCard: {
    backgroundColor: 'rgba(0, 150, 255, 0.12)',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  messageIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageTextContainer: {
    flex: 1,
  },
  messageTitle: {
    fontFamily: theme.fonts.headlineBlack,
    color: theme.colors.on_primary_container,
    fontSize: 14,
    marginBottom: 4,
  },
  messageBody: {
    fontFamily: theme.fonts.bodyMedium,
    color: theme.colors.on_surface_variant,
    fontSize: 14,
    lineHeight: 20,
  },
  bottomInputContainer: {
    position: 'absolute',
    bottom: 90,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface_container_low,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 14,
    color: theme.colors.on_surface,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  }
});
