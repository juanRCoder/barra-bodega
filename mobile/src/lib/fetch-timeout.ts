// Render (plan gratuito) tarda ~30-60 s en despertar tras estar inactivo.
const TIMEOUT_MS = 60_000;

export async function fetchWithTimeout(
  input: string,
  init: RequestInit = {},
  timeoutMs = TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(
        'El servidor tardó demasiado en responder. Si es el primer intento, puede estar despertando; vuelve a intentarlo.'
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
