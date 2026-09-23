import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PlaceRow from '../components/PlaceRow';
import { useFavorites } from '../context/FavoritesContext';
import { useLocation } from '../hooks/useLocation';
import { distanceInKm } from '../services/places';
import { colors } from '../theme/colors';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { favorites } = useFavorites();
  const location = useLocation();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>Guardados</Text>
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Todavía no guardaste ningún lugar. Tocá el corazón en un lugar para agregarlo acá.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(place) => place.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <PlaceRow
              place={item}
              distanceKm={
                location.latitude != null && location.longitude != null
                  ? distanceInKm(
                      location.latitude,
                      location.longitude,
                      item.latitude,
                      item.longitude,
                    )
                  : null
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 24,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
