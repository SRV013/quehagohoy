import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useLocation } from '../hooks/useLocation';
import { generateRecommendations, RecommendationGroup } from '../services/gemini';
import { distanceInKm, fetchNearbyPlaces, searchPlacesByText } from '../services/places';
import { colors } from '../theme/colors';
import PlaceRow from './PlaceRow';

type NearbyPlacesSectionProps = {
  query?: string;
};

export default function NearbyPlacesSection({ query = '' }: NearbyPlacesSectionProps) {
  const location = useLocation();
  const [groups, setGroups] = useState<RecommendationGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.status !== 'granted' || location.latitude == null || location.longitude == null) {
      return;
    }

    const lat = location.latitude;
    const lng = location.longitude;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!query) {
          const nearby = await fetchNearbyPlaces(lat, lng);
          if (!cancelled) setGroups([{ title: 'Cerca tuyo ahora', places: nearby }]);
          return;
        }

        const [diverse, targeted] = await Promise.all([
          fetchNearbyPlaces(lat, lng),
          searchPlacesByText(query, lat, lng),
        ]);

        const seen = new Set<string>();
        const candidates = [...targeted, ...diverse].filter((place) => {
          if (seen.has(place.id)) return false;
          seen.add(place.id);
          return true;
        });

        try {
          const result = await generateRecommendations(query, candidates);
          if (!cancelled)
            setGroups(
              result.length > 0
                ? result
                : [{ title: `Resultados para "${query}"`, places: candidates }],
            );
        } catch (aiError) {
          // Gemini puede fallar por demanda alta u otros motivos transitorios: mostramos
          // los lugares reales sin agrupar en vez de dejar la búsqueda vacía.
          console.warn('generateRecommendations failed, falling back to plain results', aiError);
          if (!cancelled) setGroups([{ title: `Resultados para "${query}"`, places: candidates }]);
        }
      } catch (err) {
        if (cancelled) return;
        console.warn('NearbyPlacesSection fetch failed', err);
        if (
          err instanceof Error &&
          (err.message === 'MISSING_API_KEY' || err.message.startsWith('PLACES_API'))
        ) {
          setError('Falta configurar alguna API key (archivo .env).');
        } else {
          setError('No pudimos cargar recomendaciones. Probá de nuevo.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [location.status, location.latitude, location.longitude, query]);

  return (
    <View style={styles.container}>
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

      {location.status === 'granted' && loading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.helperText}>
            {query ? 'Buscando las mejores opciones...' : 'Buscando lugares cerca tuyo...'}
          </Text>
        </View>
      )}

      {location.status === 'granted' && !loading && error && (
        <View style={styles.centered}>
          <Text style={styles.helperText}>{error}</Text>
        </View>
      )}

      {location.status === 'granted' && !loading && !error && groups.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.helperText}>
            {query
              ? `No encontramos resultados para "${query}".`
              : 'No encontramos lugares cerca tuyo.'}
          </Text>
        </View>
      )}

      {!loading &&
        !error &&
        groups.map((group) => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.title}>{group.title}</Text>
            {group.places.map((place) => (
              <PlaceRow
                key={place.id}
                place={place}
                distanceKm={
                  location.latitude != null && location.longitude != null
                    ? distanceInKm(
                        location.latitude,
                        location.longitude,
                        place.latitude,
                        place.longitude,
                      )
                    : null
                }
              />
            ))}
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  group: {
    marginBottom: 20,
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
});
