export class Logger {
  constructor(private context?: string) {}

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString()
    const ctx = this.context ? `[${this.context}]` : ''
    return `${timestamp} ${level} ${ctx} ${message}`
  }

  info(message: string, ...args: any[]): void {
    console.info(this.formatMessage('INFO', message), ...args)
  }

  warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage('WARN', message), ...args)
  }

  error(message: string, ...args: any[]): void {
    console.error(this.formatMessage('ERROR', message), ...args)
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('DEBUG', message), ...args)
    }
  }
}
