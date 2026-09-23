export const PLACE_TYPE_LABELS: Record<string, string> = {
  restaurant: 'Restaurante',
  bar: 'Bar',
  cafe: 'Café',
  park: 'Parque',
  tourist_attraction: 'Atracción',
  night_club: 'Vida nocturna',
};

export function placeTypeLabel(types: string[]): string {
  const match = types.find((type) => PLACE_TYPE_LABELS[type]);
  return match ? PLACE_TYPE_LABELS[match] : 'Lugar';
}
