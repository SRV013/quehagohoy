import type { NavigatorScreenParams } from '@react-navigation/native';

import { NearbyPlace } from '../services/places';

export type MainTabParamList = {
  Inicio: { prompt?: string } | undefined;
  Explorar: undefined;
  Guardados: undefined;
  Perfil: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  PlaceDetail: { place: NearbyPlace };
};
