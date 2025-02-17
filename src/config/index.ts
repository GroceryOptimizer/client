let config: Config | null = null;

export async function loadConfig(): Promise<void> {
  if (config !== null) return;

  try {
    const res = await fetch('/config.json');
    if (!res.ok) throw new Error('Failed to load configuration');

    const loadedConfig: Partial<Config> = await res.json();
    config = loadedConfig;
  } catch (error) {
    console.error('Error loading config:', error);
    config = {};
  }
}

export function getConfig(): Config {
  if (config === null) throw new Error('Configuration not loaded');
  return config;
}

interface Config {
  API_BASE_URL?: string;
}
