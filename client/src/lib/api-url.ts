// En la web las rutas son relativas (/api/...): las resuelve el proxy de Vite
// o la redirección de Netlify. En la app Capacitor (APK) el origen es
// https://localhost, así que hay que anteponer el servidor desplegado.
const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN ?? '')
  .trim()
  .replace(/\/+$/, '');

export function apiUrl(path: string) {
  return `${API_ORIGIN}${path}`;
}
