const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
  'auth/invalid-email': 'El email no es válido.',
  'auth/weak-password': 'La contraseña tiene que tener al menos 6 caracteres.',
  'auth/user-not-found': 'Email o contraseña incorrectos.',
  'auth/wrong-password': 'Email o contraseña incorrectos.',
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Probá de nuevo en un rato.',
  'auth/network-request-failed': 'Revisá tu conexión a internet.',
  'auth/operation-not-allowed': 'El login con email y contraseña no está habilitado todavía.',
  'auth/configuration-not-found': 'El login con email y contraseña no está habilitado todavía.',
};

export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  return (code && AUTH_ERROR_MESSAGES[code]) || 'Algo salió mal. Probá de nuevo.';
}
