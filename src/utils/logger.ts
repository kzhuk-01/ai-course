type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

/**
 * Lightweight logger for test execution output.
 */
export class Logger {
  private readonly context: string;

  constructor(context: string) {
    this.context = context;
  }

  /** Log an informational message. */
  info(message: string): void {
    this.log("INFO", message);
  }

  /** Log a warning message. */
  warn(message: string): void {
    this.log("WARN", message);
  }

  /** Log an error message. */
  error(message: string): void {
    this.log("ERROR", message);
  }

  /** Log a debug message. */
  debug(message: string): void {
    this.log("DEBUG", message);
  }

  private log(level: LogLevel, message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] [${this.context}] ${message}`);
  }
}
