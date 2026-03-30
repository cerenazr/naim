import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { 
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold 
} from '@expo-google-fonts/plus-jakarta-sans';
import { 
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold
} from '@expo-google-fonts/be-vietnam-pro';

import ChatScreen from './components/ChatScreen';
import TaskListScreen from './components/TaskListScreen';
import MotivationScreen from './components/MotivationScreen';
import FocusModeScreen from './components/FocusModeScreen';
import { theme } from './theme';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        PlusJakartaSans_400Regular,
        PlusJakartaSans_500Medium,
        PlusJakartaSans_600SemiBold,
        PlusJakartaSans_700Bold,
        PlusJakartaSans_800ExtraBold,
        BeVietnamPro_400Regular,
        BeVietnamPro_500Medium,
        BeVietnamPro_600SemiBold,
        BeVietnamPro_700Bold,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer}><Text>Yükleniyor...</Text></View>;
  }

  const renderScreen = () => {
    switch (currentTab) {
      case 'home':
        return <MotivationScreen />;
      case 'pocket':
        return <TaskListScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        return <FocusModeScreen />;
      default:
        return <MotivationScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Screen Render Area */}
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>

      {/* Floating Bottom Navigation Bar */}
      <View style={styles.navContainer}>
        <View style={styles.navBar}>
          <NavItem 
            icon="home" 
            label="Bugün" 
            isActive={currentTab === 'home'} 
            onPress={() => setCurrentTab('home')} 
          />
          <NavItem 
            icon="work" 
            label="Cebim" 
            isActive={currentTab === 'pocket'} 
            onPress={() => setCurrentTab('pocket')} 
          />
          <NavItem 
            icon="chat-bubble" 
            label="Sohbet" 
            isActive={currentTab === 'chat'} 
            onPress={() => setCurrentTab('chat')} 
          />
          <NavItem 
            icon="person" 
            label="Odak" 
            isActive={currentTab === 'profile'} 
            onPress={() => setCurrentTab('profile')} 
          />
        </View>
      </View>
    </View>
  );
}

function NavItem({ icon, label, isActive, onPress }: { icon: any, label: string, isActive: boolean, onPress: () => void }) {
  return (
    <TouchableOpacity 
      style={[styles.navItem, isActive && styles.navItemActive]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialIcons 
        name={icon} 
        size={24} 
        color={isActive ? theme.colors.primary_container : theme.colors.outline} 
      />
      <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenContainer: {
    flex: 1,
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: 'transparent',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 40,
    paddingVertical: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  navItemActive: {
    backgroundColor: theme.colors.surface_container_low,
  },
  navLabel: {
    fontFamily: theme.fonts.label,
    fontSize: 11,
    color: theme.colors.outline,
    marginTop: 4,
  },
  navLabelActive: {
    color: theme.colors.primary_container,
    fontFamily: theme.fonts.labelBold,
  }
});
