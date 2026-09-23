import { NearbyPlace } from './places';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const MODEL = 'gemini-3.6-flash';

export async function generatePlan(prompt: string, places: NearbyPlace[]): Promise<string> {
  if (!API_KEY) {
    throw new Error('MISSING_API_KEY');
  }

  const placesList = places
    .slice(0, 10)
    .map(
      (place) =>
        `- ${place.name} (${place.types[0] ?? 'lugar'}${place.rating ? `, rating ${place.rating}` : ''}, ${place.address})`,
    )
    .join('\n');

  const systemPrompt = `Sos el asistente de la app "QuéHagoHoy". Armá un plan corto y concreto para hoy, en español, basado ÚNICAMENTE en los lugares reales de la lista de abajo (no inventes lugares que no estén ahí).

Lo que pide el usuario: "${prompt}"

Lugares reales disponibles cerca:
${placesList || '(no se encontraron lugares, sugerí algo genérico aclarando que no hay datos)'}

Armá un plan de 2 a 4 pasos usando 1 a 3 de esos lugares (los que mejor encajen), con un título corto y una breve explicación de por qué encajan. Respondé en un tono cercano y directo, sin markdown, listo para mostrar en una tarjeta de la app.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body = JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] });

  const maxAttempts = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('EMPTY_RESPONSE');
      }
      return text.trim();
    }

    const errorBody = await response.text();
    lastError = new Error(`GEMINI_API_ERROR: ${response.status} ${errorBody}`);

    // El modelo devuelve 503 seguido cuando tiene mucha demanda; reintentamos con backoff.
    if (response.status !== 503 || attempt === maxAttempts) {
      throw lastError;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
  }

  throw lastError ?? new Error('GEMINI_API_ERROR: unknown');
}
