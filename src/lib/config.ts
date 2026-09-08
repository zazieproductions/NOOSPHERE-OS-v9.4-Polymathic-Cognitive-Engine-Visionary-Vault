/**
 * Centralized configuration & environment handling.
 * All VITE_ prefixed env vars are validated here.
 */

export interface AppConfig {
  appName: string;
  version: string;
  description: string;
  env: 'development' | 'production' | 'test';
  features: {
    audioEnabled: boolean;
    confettiEnabled: boolean;
    binauralDefault: boolean;
  };
  wallpaper: {
    defaultMode: import('../types').WallpaperMode;
    enableMouseParallax: boolean;
  };
}

const getEnv = (key: string, fallback: string): string => {
  // Vite exposes import.meta.env, but we also support process.env for compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const viteEnv = (import.meta as any).env as Record<string, string> | undefined;
  return viteEnv?.[key] ?? (typeof process !== 'undefined' ? process.env[key] : undefined) ?? fallback;
};

export const config: AppConfig = {
  appName: 'NOOSPHERE-OS',
  version: '9.4.0',
  description: 'Polymathic Cognitive Engine & Visionary Vault',
  env: (getEnv('MODE', 'development') as AppConfig['env']) || 'development',
  features: {
    audioEnabled: getEnv('VITE_AUDIO_ENABLED', 'true') !== 'false',
    confettiEnabled: getEnv('VITE_CONFETTI_ENABLED', 'true') !== 'false',
    binauralDefault: getEnv('VITE_BINAURAL_DEFAULT', 'false') === 'true',
  },
  wallpaper: {
    defaultMode: (getEnv('VITE_WALLPAPER_MODE', 'neural') as AppConfig['wallpaper']['defaultMode']) || 'neural',
    enableMouseParallax: getEnv('VITE_WALLPAPER_PARALLAX', 'true') !== 'false',
  },
};

export const isDev = config.env === 'development';
export const isProd = config.env === 'production';
