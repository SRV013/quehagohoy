import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ReactNode, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFavorites } from '../context/FavoritesContext';
import { RootStackParamList } from '../navigation/types';
import { fetchPlaceDetails, PlaceDetails, priceLevelLabel } from '../services/places';
import { colors } from '../theme/colors';
import { placeTypeLabel } from '../utils/placeLabels';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceDetail'>;

function ActionPill({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.actionPill} onPress={onPress}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={styles.actionPillText}>{label}</Text>
    </Pressable>
  );
}

function InfoRow({
  icon,
  onPress,
  expanded,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  expanded?: boolean;
  children: ReactNode;
}) {
  return (
    <Pressable style={styles.infoRow} onPress={onPress} disabled={!onPress}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>{children}</View>
      {onPress && expanded !== undefined && (
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textSecondary}
        />
      )}
    </Pressable>
  );
}

export default function PlaceDetailScreen({ route, navigation }: Props) {
  const { place } = route.params;
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [details, setDetails] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoursExpanded, setHoursExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchPlaceDetails(place.id);
        if (!cancelled) setDetails(result);
      } catch {
        if (!cancelled) setError('No pudimos cargar los detalles de este lugar.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [place.id]);

  const shown = details ?? place;
  const favorite = isFavorite(shown.id);
  const priceLabel = priceLevelLabel(details?.priceLevel ?? null);

  const handleDirections = () => {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${shown.latitude},${shown.longitude}`,
    );
  };

  const handleShare = () => {
    Share.share({
      message: shown.address ? `${shown.name} - ${shown.address}` : shown.name,
    }).catch(() => {});
  };

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
            style={[styles.roundButton, { top: insets.top + 8, left: 16 }]}
            onPress={() => navigation.goBack()}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textOnDark} />
          </Pressable>
          <Pressable
            style={[styles.roundButton, { top: insets.top + 8, right: 16 }]}
            onPress={() => toggleFavorite(shown)}
            hitSlop={8}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={20}
              color={favorite ? colors.accentPink : colors.textOnDark}
            />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{shown.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{placeTypeLabel(shown.types)}</Text>
            {shown.rating != null && (
              <Text style={styles.metaText}>
                {' · '}★ {shown.rating}
                {shown.userRatingCount ? ` (${shown.userRatingCount})` : ''}
              </Text>
            )}
            {priceLabel && (
              <Text style={styles.metaText}>
                {' · '}
                {priceLabel}
              </Text>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actionsRow}
          >
            <ActionPill icon="navigate-outline" label="Cómo llegar" onPress={handleDirections} />
            {!loading && details?.phoneNumber && (
              <ActionPill
                icon="call-outline"
                label="Llamar"
                onPress={() => Linking.openURL(`tel:${details.phoneNumber}`)}
              />
            )}
            {!loading && details?.websiteUri && (
              <ActionPill
                icon="globe-outline"
                label="Sitio web"
                onPress={() => Linking.openURL(details.websiteUri!)}
              />
            )}
            <ActionPill icon="share-social-outline" label="Compartir" onPress={handleShare} />
          </ScrollView>

          {loading && (
            <View style={styles.centered}>
              <ActivityIndicator color={colors.primary} />
            </View>
          )}

          {!loading && error && <Text style={styles.helperText}>{error}</Text>}

          {!loading && details?.editorialSummary && (
            <Text style={styles.summary}>{details.editorialSummary}</Text>
          )}

          <View style={styles.infoList}>
            {!loading && details?.openingHours && details.openingHours.length > 0 && (
              <InfoRow
                icon="time-outline"
                onPress={() => setHoursExpanded((prev) => !prev)}
                expanded={hoursExpanded}
              >
                <Text
                  style={[
                    styles.infoPrimary,
                    details.openNow === false && styles.infoPrimaryWarning,
                    details.openNow === true && styles.infoPrimarySuccess,
                  ]}
                >
                  {details.openNow == null
                    ? 'Horarios'
                    : details.openNow
                      ? 'Abierto ahora'
                      : 'Cerrado ahora'}
                </Text>
                {hoursExpanded &&
                  details.openingHours.map((line) => (
                    <Text key={line} style={styles.infoSecondary}>
                      {line}
                    </Text>
                  ))}
              </InfoRow>
            )}

            {shown.address ? (
              <InfoRow icon="location-outline" onPress={handleDirections}>
                <Text style={styles.infoPrimary}>{shown.address}</Text>
              </InfoRow>
            ) : null}

            {!loading && details?.phoneNumber && (
              <InfoRow
                icon="call-outline"
                onPress={() => Linking.openURL(`tel:${details.phoneNumber}`)}
              >
                <Text style={styles.infoPrimary}>{details.phoneNumber}</Text>
              </InfoRow>
            )}

            {!loading && details?.websiteUri && (
              <InfoRow icon="globe-outline" onPress={() => Linking.openURL(details.websiteUri!)}>
                <Text style={styles.infoPrimary} numberOfLines={1}>
                  {details.websiteUri}
                </Text>
              </InfoRow>
            )}
          </View>
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
  roundButton: {
    position: 'absolute',
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
    flexWrap: 'wrap',
    marginTop: 6,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionsRow: {
    gap: 8,
    marginTop: 16,
    paddingRight: 4,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.backgroundSubtle,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  actionPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
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
  infoList: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.category.sky,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  infoContent: {
    flex: 1,
  },
  infoPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  infoPrimaryWarning: {
    color: colors.accentPink,
  },
  infoPrimarySuccess: {
    color: colors.success,
  },
  infoSecondary: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
});
