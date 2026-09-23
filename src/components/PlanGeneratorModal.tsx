import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useLocation } from '../hooks/useLocation';
import { generatePlan } from '../services/gemini';
import { fetchNearbyPlaces, searchPlacesByText } from '../services/places';
import { colors } from '../theme/colors';

type PlanGeneratorModalProps = {
  visible: boolean;
  initialPrompt?: string;
  onClose: () => void;
};

export default function PlanGeneratorModal({ visible, initialPrompt, onClose }: PlanGeneratorModalProps) {
  const location = useLocation();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const lastAutoPrompt = useRef<string | null>(null);

  const handleGenerate = async (promptText: string) => {
    if (!promptText.trim()) return;
    if (location.latitude == null || location.longitude == null) {
      setError('Necesitamos tu ubicación para armar el plan.');
      return;
    }

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const [diverse, targeted] = await Promise.all([
        fetchNearbyPlaces(location.latitude, location.longitude),
        searchPlacesByText(promptText, location.latitude, location.longitude),
      ]);

      const seen = new Set<string>();
      const candidatePlaces = [...targeted, ...diverse].filter((place) => {
        if (seen.has(place.id)) return false;
        seen.add(place.id);
        return true;
      });

      const result = await generatePlan(promptText, candidatePlaces);
      setPlan(result);
    } catch (err) {
      if (err instanceof Error && err.message === 'MISSING_API_KEY') {
        setError('Falta configurar la API key de Gemini (archivo .env).');
      } else {
        setError('No pudimos generar el plan. Probá de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible || !initialPrompt) return;
    if (lastAutoPrompt.current === initialPrompt) return;

    lastAutoPrompt.current = initialPrompt;
    setPrompt(initialPrompt);
    handleGenerate(initialPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initialPrompt]);

  const handleClose = () => {
    setPrompt('');
    setPlan(null);
    setError(null);
    lastAutoPrompt.current = null;
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>Plan personalizado</Text>
            <Pressable onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Contame qué tenés ganas de hacer hoy..."
            placeholderTextColor={colors.textSecondary}
            value={prompt}
            onChangeText={setPrompt}
            multiline
          />

          <Pressable
            style={[styles.button, (!prompt.trim() || loading) && styles.buttonDisabled]}
            onPress={() => handleGenerate(prompt)}
            disabled={!prompt.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textOnDark} />
            ) : (
              <Text style={styles.buttonText}>Generar plan</Text>
            )}
          </Pressable>

          {error && <Text style={styles.error}>{error}</Text>}

          {plan && (
            <ScrollView style={styles.planBox}>
              <Text style={styles.planText}>{plan}</Text>
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 20, 36, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.backgroundLight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  input: {
    minHeight: 70,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.textOnDark,
    fontWeight: '700',
    fontSize: 15,
  },
  error: {
    marginTop: 12,
    fontSize: 13,
    color: colors.accentPink,
    textAlign: 'center',
  },
  planBox: {
    marginTop: 16,
    backgroundColor: colors.backgroundSubtle,
    borderRadius: 14,
    padding: 14,
  },
  planText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textPrimary,
  },
});
