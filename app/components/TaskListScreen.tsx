import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';

type Task = { id: number; label: string; done: boolean };

const initialTasks: Task[] = [
  { id: 1, label: 'İlk adımı at 🎒', done: false },
  { id: 2, label: 'Odaklan, Nobita!', done: true },
  { id: 3, label: 'Projeyi ilerlet', done: false },
];

export default function TaskListScreen() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(4);

  useEffect(() => {
    AsyncStorage.getItem('tasks').then(val => {
      if (val) {
        const saved = JSON.parse(val) as Task[];
        setTasks(saved);
        const maxId = saved.reduce((m, t) => Math.max(m, t.id), 0);
        setNextId(maxId + 1);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: number) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const addOrUpdateTask = () => {
    const text = inputText.trim();
    if (!text) return;
    if (editingId !== null) {
      setTasks(prev => prev.map(t => t.id === editingId ? { ...t, label: text } : t));
      setEditingId(null);
    } else {
      setTasks(prev => [...prev, { id: nextId, label: text, done: false }]);
      setNextId(n => n + 1);
    }
    setInputText('');
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (editingId === id) { setEditingId(null); setInputText(''); }
  };

  const startEdit = (task: Task) => {
    setInputText(task.label);
    setEditingId(task.id);
  };

  const doneCount = tasks.filter(t => t.done).length;
  const percent = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconBubble}>
            <MaterialIcons name="notifications" size={22} color={theme.colors.on_tertiary_container} />
          </View>
          <Text style={styles.headerTitle}>4D Asistanım</Text>
        </View>
        <TouchableOpacity style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS3dRFjIuZ27b7g8CVjYWQ03Ftz4BOPsOvLZ4pE0r18MltAXtYyoaFi8x2QTGMk79ABMcoTpA9vDQ89STPzMKqCEYIJDJh503Cmp4SY6FB39U0nWz-630TpHZqk1tN9nnwQuHZCvA5YyQZ7DkHE7otP4A_ee8Nb8Zj1N-Gt3BqZQQRx1fVADf9L__YMXSGu4SRiYf-xk1UGBQ3Es42XrWk1UzgTmBezmdfL7ebwsoxBMei2pYBgBGW_DyKIGzGXZYwVn7F53vR4ck' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>BİLGİ: GELECEKTEN GELDİM! 🛸</Text>
          </View>
          <Text style={styles.welcomeHeadline}>
            Merhaba Nobita,{'\n'}Bugün neler{' '}
            <Text style={styles.welcomeHighlight}>başaracağız?</Text>
          </Text>
        </View>

        {/* Task List Card */}
        <View style={styles.taskCard}>
          {/* Card decorative blob */}
          <View style={styles.cardDecor} />

          <View style={styles.taskCardHeader}>
            <Text style={styles.taskCardTitle}>Bugün yapılacaklar</Text>
            <MaterialIcons name="auto-fix-high" size={24} color={theme.colors.secondary} />
          </View>

          <View style={styles.taskList}>
            {tasks.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <TouchableOpacity
                  onPress={() => toggleTask(task.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
                    {task.done && (
                      <MaterialIcons name="check" size={16} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onLongPress={() => startEdit(task)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.taskLabel, task.done && styles.taskLabelDone,
                    editingId === task.id && styles.taskLabelEditing]}>
                    {task.label}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(task.id)} activeOpacity={0.7}>
                  <MaterialIcons name="close" size={18} color="#cbd5e1" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Progress */}
          <View style={styles.progressRow}>
            <View>
              <Text style={styles.progressLabel}>İLERLEME</Text>
              <Text style={styles.progressValue}>{doneCount} / {tasks.length} Görev Tamamlandı</Text>
            </View>
            <View style={styles.progressBadge}>
              <Text style={styles.progressPercent}>{percent}%</Text>
            </View>
          </View>
        </View>

        {/* Gadget Card */}
        <View style={styles.gadgetCard}>
          <View style={styles.gadgetTextBlock}>
            <Text style={styles.gadgetLabel}>Günün Gadget'ı</Text>
            <Text style={styles.gadgetTitle}>Hafıza Ekmeği 🍞</Text>
            <Text style={styles.gadgetDesc}>Bugünkü sınavında tüm bilgileri hemen hatırla!</Text>
          </View>
          <View style={styles.gadgetIconBlock}>
            <MaterialIcons name="menu-book" size={40} color="#fff" />
          </View>
          {/* Decorative glow */}
          <View style={styles.gadgetDecor} />
        </View>

        {/* Quick Commands */}
        <View style={styles.commandsSection}>
          <Text style={styles.commandsTitle}>Hızlı Komutlar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.commandsScroll}>
            {['Plan yap 🗓️', 'Not al 📝', 'Özetle ⚡'].map(cmd => (
              <TouchableOpacity key={cmd} style={styles.commandChip} activeOpacity={0.7}>
                <Text style={styles.commandChipText}>{cmd}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Floating Command Input */}
      <View style={styles.bottomInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={editingId !== null ? 'Görevi düzenle...' : 'Yeni görev ekle...'}
          placeholderTextColor={theme.colors.outline}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={addOrUpdateTask}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.sendButton} onPress={addOrUpdateTask}>
          <MaterialIcons name={editingId !== null ? 'check' : 'add'} size={20} color="#fff" />
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
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 40,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.tertiary_fixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: theme.fonts.headlineBlack,
    fontSize: 20,
    color: '#2563eb',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.primary_container,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 160,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 150, 255, 0.1)',
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
  },
  badgeText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.5,
    color: theme.colors.primary,
  },
  welcomeHeadline: {
    fontFamily: theme.fonts.headlineBlack,
    fontSize: 36,
    lineHeight: 44,
    color: theme.colors.on_surface,
  },
  welcomeHighlight: {
    color: theme.colors.primary,
  },
  taskCard: {
    backgroundColor: theme.colors.surface_container_lowest,
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 40,
    elevation: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  cardDecor: {
    position: 'absolute',
    top: -16,
    right: -16,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primary_container,
    opacity: 0.05,
  },
  taskCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  taskCardTitle: {
    fontFamily: theme.fonts.headlineBlack,
    fontSize: 22,
    color: theme.colors.primary,
  },
  taskList: {
    gap: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.colors.primary_container,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxDone: {
    backgroundColor: theme.colors.primary_container,
    borderColor: theme.colors.primary_container,
  },
  taskLabel: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 17,
    color: theme.colors.on_surface_variant,
  },
  taskLabelDone: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  taskLabelEditing: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bodyBold,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface_container,
  },
  progressLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2,
    color: theme.colors.on_surface_variant,
    marginBottom: 4,
  },
  progressValue: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.primary,
  },
  progressBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.secondary_container,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontFamily: theme.fonts.headlineBlack,
    fontSize: 12,
    color: '#fff',
  },
  gadgetCard: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  gadgetTextBlock: {
    flex: 1,
  },
  gadgetLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  gadgetTitle: {
    fontFamily: theme.fonts.headlineBlack,
    fontSize: 20,
    color: '#fff',
    lineHeight: 26,
  },
  gadgetDesc: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    lineHeight: 18,
  },
  gadgetIconBlock: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  gadgetDecor: {
    position: 'absolute',
    right: -16,
    bottom: -16,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  commandsSection: {
    gap: 16,
  },
  commandsTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
    color: theme.colors.on_surface_variant,
    textTransform: 'uppercase',
    paddingHorizontal: 8,
  },
  commandsScroll: {
    flexGrow: 0,
  },
  commandChip: {
    backgroundColor: theme.colors.surface_container_high,
    borderRadius: 99,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginRight: 12,
  },
  commandChipText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14,
    color: theme.colors.on_surface,
  },
  bottomInputContainer: {
    position: 'absolute',
    bottom: 90,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 99,
    paddingLeft: 24,
    paddingRight: 8,
    paddingVertical: 8,
    shadowColor: theme.colors.primary_container,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  textInput: {
    flex: 1,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: 14,
    color: theme.colors.on_surface,
    paddingVertical: 8,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.secondary_container,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
