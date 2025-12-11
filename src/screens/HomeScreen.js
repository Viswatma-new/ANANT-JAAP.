// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = '@naam_jaap_state';

export default function HomeScreen({ onOpenHistory }) {
  const [mantraInput, setMantraInput] = useState('');

  const [data, setData] = useState({
    currentMantra: 'Radha Naam Japa',
    mantras: {
      'Radha Naam Japa': {
        totalMala: 0,
        sessionMala: 0,
        sessionJapa: 0,
      },
    },
  });

  // Load saved state
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setData(parsed);
        }
      } catch (e) {
        console.log('Error loading state', e);
      }
    };
    load();
  }, []);

  const save = useCallback(async (next) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.log('Error saving state', e);
    }
  }, []);

  const ensureMantraExists = (name, prevData) => {
    if (prevData.mantras[name]) return prevData;
    return {
      ...prevData,
      mantras: {
        ...prevData.mantras,
        [name]: { totalMala: 0, sessionMala: 0, sessionJapa: 0 },
      },
    };
  };

  const handleTapCircle = () => {
    setData(prev => {
      const name = prev.currentMantra;
      let next = ensureMantraExists(name, prev);
      const current = next.mantras[name];

      let sessionJapa = current.sessionJapa + 1;
      let sessionMala = current.sessionMala;
      let totalMala = current.totalMala;

      if (sessionJapa >= 108) {
        sessionJapa = 0;
        sessionMala += 1;
        totalMala += 1;
      }

      const updated = {
        ...next,
        mantras: {
          ...next.mantras,
          [name]: { totalMala, sessionMala, sessionJapa },
        },
      };
      save(updated);
      return updated;
    });
  };

  const handleSaveMantra = () => {
    const name = mantraInput.trim();
    if (!name) return;

    setData(prev => {
      let next = ensureMantraExists(name, prev);
      next = {
        ...next,
        currentMantra: name,
      };
      save(next);
      return next;
    });
    setMantraInput('');
  };

  const handleSelectMantra = (name) => {
    setData(prev => {
      const next = ensureMantraExists(name, prev);
      const updated = { ...next, currentMantra: name };
      save(updated);
      return updated;
    });
  };

  const handleResetSession = () => {
    const name = data.currentMantra;
    Alert.alert(
      'Reset session?',
      `This will clear current session counts for "${name}" but keep total mala.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setData(prev => {
              const current = prev.mantras[name] || {
                totalMala: 0,
                sessionMala: 0,
                sessionJapa: 0,
              };
              const updated = {
                ...prev,
                mantras: {
                  ...prev.mantras,
                  [name]: {
                    ...current,
                    sessionMala: 0,
                    sessionJapa: 0,
                  },
                },
              };
              save(updated);
              return updated;
            });
          },
        },
      ],
    );
  };

  const currentName = data.currentMantra;
  const current = data.mantras[currentName] || {
    totalMala: 0,
    sessionMala: 0,
    sessionJapa: 0,
  };

  const mantraNames = Object.keys(data.mantras);

   return (
    <View style={styles.container}>
      {/* Header with icon + title + history button */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft} />
        <View style={styles.headerCenter}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>ॐ</Text>
          </View>
          <Text style={styles.title}>{currentName}</Text>
          <Text style={styles.subtitle}>Divine Counter</Text>
        </View>
        <TouchableOpacity
          style={styles.historyIcon}
          onPress={onOpenHistory}
          activeOpacity={0.7}
        >
          <Ionicons name="time-outline" size={24} color="#5c4630" />
        </TouchableOpacity>
      </View>

      {/* Middle circular counter */}
      <View style={styles.center}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleTapCircle}
          style={styles.circleOuter}
        >
          <View style={styles.circleInner}>
            <Text style={styles.japaNumber}>{current.sessionJapa}</Text>
            <Text style={styles.japaLabel}>Current Japa (0–108)</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.malaText}>
          Session mala: {current.sessionMala}
        </Text>
        <Text style={styles.malaText}>
          Total mala: {current.totalMala}
        </Text>
        <Text style={styles.helperText}>
          Tap inside the circle to do jaap.
        </Text>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetSession}
          activeOpacity={0.7}
        >
          <Text style={styles.resetButtonText}>Reset session</Text>
        </TouchableOpacity>

        {/* Past mantras chips */}
        {mantraNames.length > 1 && (
          <View style={styles.chipsContainer}>
            <Text style={styles.chipsLabel}>Previous mantras:</Text>
            <FlatList
              horizontal
              data={mantraNames}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.chip,
                    item === currentName && styles.chipActive,
                  ]}
                  onPress={() => handleSelectMantra(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipText,
                      item === currentName && styles.chipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Bottom input bar */}
      <View style={styles.bottomBar}>
        <TextInput
          style={styles.input}
          placeholder="Enter your mantra / naam"
          placeholderTextColor="#b0a9a0"
          value={mantraInput}
          onChangeText={setMantraInput}
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveMantra}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Set Mantra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PRIMARY = '#FF6B6B';
const BG = '#FFF6E9';
const CARD = '#FFFFFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    width: 32,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  historyIcon: {
    width: 32,
    alignItems: 'flex-end',
  },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 28,
    color: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2b2014',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#b39a80',
    marginTop: 4,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  circleOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 16,
    borderColor: '#ffd0b0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  circleInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  japaNumber: {
    fontSize: 40,
    fontWeight: '700',
    color: '#2b2014',
  },
  japaLabel: {
    fontSize: 14,
    color: '#b39a80',
    marginTop: 4,
  },
  malaText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2b2014',
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: '#9a7d5c',
  },
  resetButton: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d2b79a',
  },
  resetButtonText: {
    fontSize: 12,
    color: '#7a5b3a',
  },
  chipsContainer: {
    marginTop: 16,
    width: '100%',
  },
  chipsLabel: {
    fontSize: 12,
    color: '#9a7d5c',
    marginBottom: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3e0ce',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: PRIMARY,
  },
  chipText: {
    fontSize: 12,
    color: '#5c4630',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  bottomBar: {
    marginTop: 8,
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  input: {
    flex: 1,
    color: '#2b2014',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  saveButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
