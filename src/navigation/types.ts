import { NearbyPlace } from '../services/places';

export type RootStackParamList = {
  Home: undefined;
  PlaceDetail: { place: NearbyPlace };
};
