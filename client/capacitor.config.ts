import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tuusuario.miapp',
  appName: 'BarraBodega',
  webDir: 'dist',
  plugins: {
    // fetch nativo: guarda la cookie del refresh token y evita CORS.
    CapacitorHttp: { enabled: true },
  },
};

export default config;
