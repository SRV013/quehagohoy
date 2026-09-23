import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

type LocationState = {
  latitude: number | null;
  longitude: number | null;
  status: 'idle' | 'loading' | 'granted' | 'denied' | 'error';
  errorMessage: string | null;
};

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    status: 'idle',
    errorMessage: null,
  });

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setState((prev) => ({ ...prev, status: 'loading' }));

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (isMounted) {
          setState({
            latitude: null,
            longitude: null,
            status: 'denied',
            errorMessage: 'Necesitamos tu ubicación para mostrarte lugares cercanos.',
          });
        }
        return;
      }

      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (isMounted) {
          setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            status: 'granted',
            errorMessage: null,
          });
        }
      } catch {
        if (isMounted) {
          setState({
            latitude: null,
            longitude: null,
            status: 'error',
            errorMessage: 'No pudimos obtener tu ubicación.',
          });
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
