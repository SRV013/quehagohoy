// Paleta extraída de logo.png y forma1.png (muestreo de píxeles real, no aproximado).
export const colors = {
  primary: '#146EFE', // azul de botones y estados activos (nav, CTAs)
  brandBlue: '#0EA5FF', // azul del wordmark/logo ("Hago")
  secondary: '#1FE0C2',

  accentOrange: '#F5B23A',
  accentPink: '#F4506E',
  accentPurple: '#8B78F7',

  backgroundDark: '#0B1424',
  backgroundLight: '#FFFFFF',
  backgroundSubtle: '#F6F8FC',

  textPrimary: '#0B1736',
  textSecondary: '#8C94A6',
  textOnDark: '#FFFFFF',
  textOnDarkSecondary: '#A9B4C8',
  inactive: '#5B6B85', // íconos/labels inactivos (nav)

  border: '#E5E9F0',
  success: '#006134', // tag "Recomendado"

  category: {
    peach: '#FCE5C6',
    pink: '#FDD5E2',
    mint: '#BFFBE4',
    sky: '#C2ECFE',
    lavender: '#DBD8FE',
    yellow: '#FEE995',
    sage: '#DFF0E3',
    orchid: '#FADFF0',
  },
} as const;

export type Colors = typeof colors;
