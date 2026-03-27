// path: src/utils/envHelper.ts
import * as dotenv from "dotenv";
import * as path from "node:path";

/**
 * Utility for loading and accessing environment variables with type-safe defaults.
 */
export class EnvHelper {
  /** Load the .env file from the project root. */
  static load(): void {
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  }

  /** Get a string environment variable, with an optional default. */
  static get(key: string, defaultValue = ""): string {
    return process.env[key] ?? defaultValue;
  }

  /** Get a numeric environment variable, with an optional default. */
  static getNumber(key: string, defaultValue = 0): number {
    const value = process.env[key];
    if (value === undefined) return defaultValue;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }

  /** Get a boolean environment variable, with an optional default. */
  static getBoolean(key: string, defaultValue = false): boolean {
    const value = process.env[key];
    return value !== undefined ? value === "true" : defaultValue;
  }
}
