const API_URL = 'http://localhost:3000';

export async function getReader(signal: AbortSignal) {
  const response = await fetch(API_URL, {
    signal,
  });

  const reader = response.body?.pipeThrough(new TextDecoderStream()).pipeThrough(parseNDJSON());
  return reader;
}

function parseNDJSON() {
  return new TransformStream({
    transform(chunk, controller) {
      for (const item of chunk.split('\n')) {
        if (!item) continue;
        try {
          controller.enqueue(item);
        } catch (error) {
          console.error('Error parsing NDJSON:', error);
        }
      }
    },
  });
}
