import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme/colors';

type PromptModalProps = {
  visible: boolean;
  onSubmit: (prompt: string) => void;
  onClose: () => void;
};

const IDEAS = [
  'Tengo hambre y no sé qué comer',
  'Quiero salir con amigos',
  'Plan romántico para hoy',
  'Algo tranquilo al aire libre',
  'Estoy aburrido, sorprendeme',
];

export default function PromptModal({ visible, onSubmit, onClose }: PromptModalProps) {
  const [prompt, setPrompt] = useState('');

  const handleClose = () => {
    setPrompt('');
    onClose();
  };

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    onSubmit(prompt.trim());
    setPrompt('');
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="sparkles" size={16} color={colors.primary} />
            </View>
            <Text style={styles.title}>Dame ideas</Text>
            <Pressable onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Text style={styles.helper}>Contanos qué tenés ganas de hacer, o elegí una idea:</Text>

          <View style={styles.ideas}>
            {IDEAS.map((idea) => (
              <Pressable key={idea} style={styles.ideaChip} onPress={() => setPrompt(idea)}>
                <Text style={styles.ideaChipText}>{idea}</Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Ej: quiero algo divertido y barato para esta noche..."
            placeholderTextColor={colors.textSecondary}
            value={prompt}
            onChangeText={setPrompt}
            onSubmitEditing={handleSubmit}
            multiline
          />

          <Pressable
            style={[styles.button, !prompt.trim() && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!prompt.trim()}
          >
            <Ionicons name="search" size={16} color={colors.textOnDark} />
            <Text style={styles.buttonText}>Buscar ideas</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 20, 36, 0.55)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.category.sky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  helper: {
    marginTop: 10,
    fontSize: 13,
    color: colors.textSecondary,
  },
  ideas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  ideaChip: {
    backgroundColor: colors.backgroundSubtle,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ideaChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  input: {
    minHeight: 70,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    marginTop: 16,
    fontSize: 14,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.textOnDark,
    fontWeight: '700',
    fontSize: 15,
  },
});
