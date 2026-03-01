const TRUTHY_VALUES = new Set(["1", "true", "yes", "on"]);
const FALSY_VALUES = new Set(["0", "false", "no", "off"]);

export const envBoolean = (name: string, fallback: boolean): boolean => {
  const raw = process.env[name];
  if (raw === undefined) {
    return fallback;
  }

  const value = raw.trim().toLowerCase();
  if (TRUTHY_VALUES.has(value)) {
    return true;
  }
  if (FALSY_VALUES.has(value)) {
    return false;
  }

  return fallback;
};

export const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const optionalEnv = (name: string): string | undefined => {
  const value = process.env[name];
  if (!value) {
    return undefined;
  }
  return value;
};
