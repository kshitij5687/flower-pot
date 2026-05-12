// Utility helpers for required environment variables.

export const requireEnv = (key: string): string => {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    throw new Error(`${key} is not defined in environment variables.`);
  }

  return value;
};
