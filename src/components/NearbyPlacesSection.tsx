import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useLocation } from '../hooks/useLocation';
import { distanceInKm, fetchNearbyPlaces, NearbyPlace, searchPlacesByText } from '../services/places';
import { colors } from '../theme/colors';

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

type NearbyPlacesSectionProps = {
  query?: string;
};

export default function NearbyPlacesSection({ query = '' }: NearbyPlacesSectionProps) {
  const location = useLocation();
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.status !== 'granted' || location.latitude == null || location.longitude == null) {
      return;
    }

    let cancelled = false;
    setLoadingPlaces(true);
    setError(null);

    const request = query
      ? searchPlacesByText(query, location.latitude, location.longitude)
      : fetchNearbyPlaces(location.latitude, location.longitude);

    request
      .then((results) => {
        if (!cancelled) setPlaces(results);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof Error && err.message === 'MISSING_API_KEY') {
          setError('Falta configurar la API key de Google Places (archivo .env).');
        } else {
          setError('No pudimos cargar lugares cercanos.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPlaces(false);
      });

    return () => {
      cancelled = true;
    };
  }, [location.status, location.latitude, location.longitude, query]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{query ? `Resultados para "${query}"` : 'Cerca tuyo ahora'}</Text>

      {location.status === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.helperText}>Buscando tu ubicación...</Text>
        </View>
      )}

      {(location.status === 'denied' || location.status === 'error') && (
        <View style={styles.centered}>
          <Ionicons name="location-outline" size={22} color={colors.textSecondary} />
          <Text style={styles.helperText}>{location.errorMessage}</Text>
        </View>
      )}

      {location.status === 'granted' && loadingPlaces && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.helperText}>Buscando lugares cerca tuyo...</Text>
        </View>
      )}

      {location.status === 'granted' && !loadingPlaces && error && (
        <View style={styles.centered}>
          <Text style={styles.helperText}>{error}</Text>
        </View>
      )}

      {location.status === 'granted' && !loadingPlaces && !error && places.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.helperText}>
            {query ? `No encontramos resultados para "${query}".` : 'No encontramos lugares cerca tuyo.'}
          </Text>
        </View>
      )}

      {places.map((place) => {
        const distance =
          location.latitude != null && location.longitude != null
            ? distanceInKm(location.latitude, location.longitude, place.latitude, place.longitude)
            : null;

        return (
          <Pressable key={place.id} style={styles.row}>
            <View style={styles.thumbnail}>
              {place.photoUrl ? (
                <Image source={{ uri: place.photoUrl }} style={styles.thumbnailImage} />
              ) : (
                <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
              )}
            </View>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {place.name}
              </Text>
              <Text style={styles.meta} numberOfLines={1}>
                {typeLabel(place.types)}
                {place.rating ? ` · ★ ${place.rating}` : ''}
                {distance != null ? ` · ${distance.toFixed(1)} km` : ''}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  helperText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.backgroundSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
