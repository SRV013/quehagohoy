import { NearbyPlace } from './places';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const MODEL = 'gemini-3.6-flash';

export async function generatePlan(prompt: string, places: NearbyPlace[]): Promise<string> {
  if (!API_KEY) {
    throw new Error('MISSING_API_KEY');
  }

  const placesList = places
    .slice(0, 20)
    .map(
      (place) =>
        `- ${place.name} (${place.types[0] ?? 'lugar'}${place.rating ? `, rating ${place.rating}` : ''}, ${place.address})`,
    )
    .join('\n');

  const systemPrompt = `Sos el asistente de la app "QuéHagoHoy". Tu trabajo es entender lo que el usuario tiene ganas de hacer (a veces es algo vago o mezcla varias ganas distintas, tipo "estoy aburrido y con hambre") y armarle un plan concreto para hoy, en español, usando ÚNICAMENTE lugares reales de la lista de abajo (nunca inventes un lugar que no esté ahí).

Lo que pide el usuario: "${prompt}"

Lugares reales disponibles cerca (de distintos rubros: comida, aire libre, entretenimiento, etc.):
${placesList || '(no se encontraron lugares cerca; avisale al usuario que no hay datos suficientes por ahora, sin inventar nada)'}

Cómo responder:
1. Arrancá con UNA frase corta y cercana reconociendo lo que pidió (ej: "Te armo un plan para cuando estás aburrido y con hambre:"). Nada de relleno después de esa frase.
2. Si el pedido mezcla varias ganas o necesidades (ej. aburrido + hambre), atendé cada una por separado, no las mezcles en un solo paso.
3. Para cada necesidad, si hay más de una opción real que encaje, ofrecé 2 alternativas concretas (ej. "para comer: pasta en X o algo más rápido en Y") en vez de una sola imposición.
4. Usá entre 2 y 5 lugares reales de la lista en total. Nunca inventes nombres, direcciones ni datos que no estén en la lista.
5. Cerrá sin frases de relleno tipo "espero que te sirva". Directo al grano.

Formato: texto plano, sin markdown ni asteriscos, listo para mostrar en una tarjeta de la app.`;

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
