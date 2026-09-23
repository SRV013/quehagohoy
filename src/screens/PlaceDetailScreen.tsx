import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../navigation/types';
import { fetchPlaceDetails, PlaceDetails } from '../services/places';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceDetail'>;

const TYPE_LABELS: Record<string, string> = {
  restaurant: 'Restaurante',
  bar: 'Bar',
  cafe: 'Café',
  park: 'Parque',
  tourist_attraction: 'Atracción',
  night_club: 'Vida nocturna',
};

function typeLabel(types: string[]): string {
  const match = types.find((type) => TYPE_LABELS[type]);
  return match ? TYPE_LABELS[match] : 'Lugar';
}

export default function PlaceDetailScreen({ route, navigation }: Props) {
  const { place } = route.params;
  const insets = useSafeAreaInsets();
  const [details, setDetails] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPlaceDetails(place.id)
      .then((result) => {
        if (!cancelled) setDetails(result);
      })
      .catch(() => {
        if (!cancelled) setError('No pudimos cargar los detalles de este lugar.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [place.id]);

  const shown = details ?? place;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          {shown.photoUrl ? (
            <Image source={{ uri: shown.photoUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="location-outline" size={40} color={colors.textSecondary} />
            </View>
          )}
          <Pressable
            style={[styles.backButton, { top: insets.top + 8 }]}
            onPress={() => navigation.goBack()}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textOnDark} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{shown.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{typeLabel(shown.types)}</Text>
            {shown.rating != null && (
              <Text style={styles.metaText}>
                {' · '}★ {shown.rating}
                {shown.userRatingCount ? ` (${shown.userRatingCount})` : ''}
              </Text>
            )}
          </View>
          <Text style={styles.address}>{shown.address}</Text>

          {loading && (
            <View style={styles.centered}>
              <ActivityIndicator color={colors.primary} />
            </View>
          )}

          {!loading && error && <Text style={styles.helperText}>{error}</Text>}

          {!loading && details?.editorialSummary && (
            <Text style={styles.summary}>{details.editorialSummary}</Text>
          )}

          {!loading && details?.openingHours && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Horarios</Text>
              {details.openingHours.map((line) => (
                <Text key={line} style={styles.sectionText}>
                  {line}
                </Text>
              ))}
            </View>
          )}

          {!loading && details?.phoneNumber && (
            <Pressable
              style={styles.actionRow}
              onPress={() => Linking.openURL(`tel:${details.phoneNumber}`)}
            >
              <Ionicons name="call-outline" size={18} color={colors.primary} />
              <Text style={styles.actionText}>{details.phoneNumber}</Text>
            </Pressable>
          )}

          {!loading && details?.websiteUri && (
            <Pressable
              style={styles.actionRow}
              onPress={() => Linking.openURL(details.websiteUri!)}
            >
              <Ionicons name="globe-outline" size={18} color={colors.primary} />
              <Text style={styles.actionText} numberOfLines={1}>
                {details.websiteUri}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  imageWrapper: {
    width: '100%',
    height: 240,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.backgroundSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(11, 20, 36, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  address: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  centered: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  helperText: {
    marginTop: 16,
    fontSize: 13,
    color: colors.textSecondary,
  },
  summary: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    flexShrink: 1,
  },
});
