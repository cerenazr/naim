// JsonRenderer.tsx
// Doraemon'un cebinden çıkan gadget'ı render eder.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DoraemonResponse } from '../utils/mockRespond';

type Props = {
  response: DoraemonResponse | null;
};

export default function JsonRenderer({ response }: Props) {
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Reset states when a new response arrives
  useEffect(() => {
    if (!response) return;
    
    if (response.type === 'task_list') {
      setCheckedItems(new Array(response.items.length).fill(false));
    }
    
    if (response.type === 'focus_card') {
      setTimeLeft(response.duration_min * 60);
      setIsActive(true);
    }
  }, [response]);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  if (!response) return null;

  const toggleItem = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  switch (response.type) {
    case 'task_list':
      return (
        <View style={styles.card}>
          <Text style={styles.title}>📝 {response.title}</Text>
          {response.items.map((item, i) => (
            <TouchableOpacity 
              key={i} 
              style={[styles.taskItemBase, checkedItems[i] && styles.taskItemChecked]} 
              onPress={() => toggleItem(i)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, checkedItems[i] && styles.checkboxActive]}>
                {checkedItems[i] && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={[styles.taskText, checkedItems[i] && styles.taskTextChecked]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );

    case 'motivation':
      return (
        <View style={[styles.card, styles.motivationCard]}>
          <Text style={styles.quoteMark}>“</Text>
          <Text style={styles.quote}>{response.quote}</Text>
          {response.author && (
            <Text style={styles.author}>— {response.author}</Text>
          )}
        </View>
      );

    case 'focus_card':
      return (
        <View style={[styles.card, styles.focusCard]}>
          <Text style={styles.focusTitle}>🎯 {response.title}</Text>
          
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            {timeLeft === 0 && <Text style={styles.timerDone}>Süre Bitti! 🔔</Text>}
          </View>
          
          <View style={styles.stepsContainer}>
            {response.steps.map((step, i) => (
              <View key={i} style={styles.stepItem}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      );

    default:
      return (
        <View style={styles.card}>
          <Text style={styles.title}>Yeni alet bulundu! 🎒</Text>
          <Text style={styles.rawText}>{JSON.stringify(response, null, 2)}</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    margin: 20,
    shadowColor: '#0096ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e6f2ff',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0096ff', // Doraemon blue
    marginBottom: 20,
  },
  
  // Task List
  taskItemBase: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fcff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e6f2ff',
  },
  taskItemChecked: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#0096ff',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxActive: {
    backgroundColor: '#0096ff',
    borderColor: '#0096ff',
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    flex: 1,
  },
  taskTextChecked: {
    color: '#999999',
    textDecorationLine: 'line-through',
  },

  // Motivation Card
  motivationCard: {
    backgroundColor: '#fffbeb', // soft yellow 
    borderColor: '#ffcc00',     // bell yellow
    borderWidth: 2,
    alignItems: 'center',
  },
  quoteMark: {
    fontSize: 64,
    color: '#ffcc00',
    fontWeight: 'bold',
    opacity: 0.5,
    marginBottom: -20,
    marginTop: -10,
  },
  quote: {
    fontSize: 24,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#e60012', // red accent
    lineHeight: 34,
    textAlign: 'center',
    marginBottom: 16,
  },
  author: {
    fontSize: 16,
    color: '#0096ff',
    fontWeight: '700',
    alignSelf: 'flex-end',
  },

  // Focus Card
  focusCard: {
    borderColor: '#e60012', // collar red string
    borderWidth: 2,
  },
  focusTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#e60012',
    marginBottom: 16,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    backgroundColor: '#fff5f5',
    paddingVertical: 30,
    borderRadius: 24,
  },
  timerText: {
    fontSize: 64,
    fontWeight: '900',
    color: '#e60012',
    letterSpacing: 2,
  },
  timerDone: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0096ff',
    marginTop: 10,
  },
  stepsContainer: {
    marginTop: 10,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0096ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    flex: 1,
  },

  // Default / Raw Response
  rawText: {
    fontSize: 14,
    color: '#555555',
  }
});
