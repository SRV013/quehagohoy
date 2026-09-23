import { NearbyPlace } from './places';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const MODEL = 'gemini-3.6-flash';

export type RecommendationGroup = {
  title: string;
  places: NearbyPlace[];
};

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    groups: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          placeIds: { type: 'ARRAY', items: { type: 'STRING' } },
        },
        required: ['title', 'placeIds'],
      },
    },
  },
  required: ['groups'],
};

export async function generateRecommendations(
  prompt: string,
  candidates: NearbyPlace[],
): Promise<RecommendationGroup[]> {
  if (!API_KEY) {
    throw new Error('MISSING_API_KEY');
  }

  const placesList = candidates
    .slice(0, 25)
    .map((place) => `${place.id}|${place.name}|${place.types[0] ?? 'lugar'}|rating ${place.rating ?? '-'}`)
    .join('\n');

  const systemPrompt = `Sos el motor de recomendaciones de la app "QuéHagoHoy". El usuario escribe lo que tiene ganas de hacer (a veces mezcla varias ganas distintas, ej: "estoy aburrido y con hambre"). Tu trabajo es separar el pedido en 1 a 4 grupos por necesidad y, para cada uno, elegir los lugares reales de la lista que mejor encajan. Nunca inventes lugares ni ids que no estén en la lista.

Pedido del usuario: "${prompt}"

Lugares reales disponibles cerca (formato id|nombre|rubro|rating):
${placesList || '(no hay lugares disponibles)'}

Reglas:
- Si el pedido tiene una sola necesidad clara, devolvé 1 solo grupo.
- Si mezcla varias (ej. comer + aire libre + entretenimiento), separá un grupo por cada una.
- El título de cada grupo tiene que ser corto y describir la necesidad + lo que pidió, ej: "Lugares para comer algo rico", "Para despejarte al aire libre". No repitas la palabra "lugares" en todos los títulos.
- Cada grupo lleva de 2 a 5 placeIds reales, ordenados del que mejor encaja al que menos.
- Usá SOLO ids que estén en la lista de arriba. Si no hay ningún lugar que encaje con una necesidad, no incluyas ese grupo.

Devolvé únicamente el JSON con la forma indicada, nada de texto extra.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body = JSON.stringify({
    contents: [{ parts: [{ text: systemPrompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
    },
  });

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

      let parsed: { groups?: { title: string; placeIds: string[] }[] };
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error('INVALID_JSON');
      }

      const byId = new Map(candidates.map((place) => [place.id, place]));

      return (parsed.groups ?? [])
        .map((group) => ({
          title: group.title,
          places: (group.placeIds ?? [])
            .map((id) => byId.get(id))
            .filter((place): place is NearbyPlace => Boolean(place)),
        }))
        .filter((group) => group.places.length > 0);
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
