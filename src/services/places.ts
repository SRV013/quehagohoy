export type NearbyPlace = {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  userRatingCount: number | null;
  types: string[];
  latitude: number;
  longitude: number;
  photoUrl: string | null;
};

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const INCLUDED_TYPES = ['restaurant', 'bar', 'cafe', 'park', 'tourist_attraction', 'night_club'];

const FIELD_MASK =
  'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.photos';

function mapPlace(place: any, fallbackLat: number, fallbackLng: number): NearbyPlace {
  return {
    id: place.id,
    name: place.displayName?.text ?? 'Sin nombre',
    address: place.formattedAddress ?? '',
    rating: place.rating ?? null,
    userRatingCount: place.userRatingCount ?? null,
    types: place.types ?? [],
    latitude: place.location?.latitude ?? fallbackLat,
    longitude: place.location?.longitude ?? fallbackLng,
    photoUrl: place.photos?.[0]
      ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxWidthPx=400&key=${API_KEY}`
      : null,
  };
}

export async function fetchNearbyPlaces(
  latitude: number,
  longitude: number,
  radiusMeters = 3000,
): Promise<NearbyPlace[]> {
  if (!API_KEY) {
    throw new Error('MISSING_API_KEY');
  }

  const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: INCLUDED_TYPES,
      maxResultCount: 20,
      rankPreference: 'DISTANCE',
      locationRestriction: {
        circle: {
          center: { latitude, longitude },
          radius: radiusMeters,
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PLACES_API_ERROR: ${response.status} ${body}`);
  }

  const data = await response.json();
  const places = data.places ?? [];

  return places.map((place: any) => mapPlace(place, latitude, longitude));
}

export async function searchPlacesByText(
  query: string,
  latitude: number,
  longitude: number,
  radiusMeters = 8000,
): Promise<NearbyPlace[]> {
  if (!API_KEY) {
    throw new Error('MISSING_API_KEY');
  }

  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: query,
      maxResultCount: 20,
      locationBias: {
        circle: {
          center: { latitude, longitude },
          radius: radiusMeters,
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PLACES_API_ERROR: ${response.status} ${body}`);
  }

  const data = await response.json();
  const places = data.places ?? [];
  const mapped: NearbyPlace[] = places.map((place: any) => mapPlace(place, latitude, longitude));

  // locationBias es una preferencia, no una restricción dura: Google puede devolver
  // resultados lejanos si el texto matchea mejor en otro lado. Los descartamos.
  const maxKm = radiusMeters / 1000;
  return mapped
    .filter((place) => distanceInKm(latitude, longitude, place.latitude, place.longitude) <= maxKm)
    .sort(
      (a, b) =>
        distanceInKm(latitude, longitude, a.latitude, a.longitude) -
        distanceInKm(latitude, longitude, b.latitude, b.longitude),
    );
}

export function distanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
