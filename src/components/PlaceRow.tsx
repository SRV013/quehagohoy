import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../navigation/types';
import { NearbyPlace } from '../services/places';
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

type PlaceRowProps = {
  place: NearbyPlace;
  distanceKm: number | null;
};

export default function PlaceRow({ place, distanceKm }: PlaceRowProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
          {typeLabel(place.types)}
          {place.rating ? ` · ★ ${place.rating}` : ''}
          {distanceKm != null ? ` · ${distanceKm.toFixed(1)} km` : ''}
        </Text>
      </View>
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
});
