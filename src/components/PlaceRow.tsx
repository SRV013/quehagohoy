import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useFavorites } from '../context/FavoritesContext';
import { RootStackParamList } from '../navigation/types';
import { NearbyPlace } from '../services/places';
import { colors } from '../theme/colors';
import { placeTypeLabel } from '../utils/placeLabels';

type PlaceRowProps = {
  place: NearbyPlace;
  distanceKm: number | null;
};

export default function PlaceRow({ place, distanceKm }: PlaceRowProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(place.id);

  return (
    <Pressable style={styles.row} onPress={() => navigation.navigate('PlaceDetail', { place })}>
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
          {placeTypeLabel(place.types)}
          {place.rating ? ` · ★ ${place.rating}` : ''}
          {distanceKm != null ? ` · ${distanceKm.toFixed(1)} km` : ''}
        </Text>
      </View>
      <Pressable hitSlop={10} style={styles.favoriteButton} onPress={() => toggleFavorite(place)}>
        <Ionicons
          name={favorite ? 'heart' : 'heart-outline'}
          size={20}
          color={favorite ? colors.accentPink : colors.textSecondary}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  favoriteButton: {
    padding: 4,
  },
});
