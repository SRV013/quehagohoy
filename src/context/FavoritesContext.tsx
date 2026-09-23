import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { NearbyPlace } from '../services/places';

const STORAGE_KEY = 'quehagohoy:favorites';

type FavoritesContextValue = {
  favorites: NearbyPlace[];
  isFavorite: (placeId: string) => boolean;
  toggleFavorite: (place: NearbyPlace) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoritesById, setFavoritesById] = useState<Record<string, NearbyPlace>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) return;
        setFavoritesById(JSON.parse(raw));
      })
      .catch((error) => console.warn('No pudimos leer los favoritos guardados', error))
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Evitamos pisar el storage con {} mientras todavía no terminamos de leerlo.
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesById)).catch((error) =>
      console.warn('No pudimos guardar los favoritos', error),
    );
  }, [favoritesById, loaded]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites: Object.values(favoritesById),
      isFavorite: (placeId) => placeId in favoritesById,
      toggleFavorite: (place) =>
        setFavoritesById((prev) => {
          const next = { ...prev };
          if (next[place.id]) {
            delete next[place.id];
          } else {
            next[place.id] = place;
          }
          return next;
        }),
    }),
    [favoritesById],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe usarse dentro de un FavoritesProvider');
  }
  return context;
}
