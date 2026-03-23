import winston from 'winston';

export class Logger {
  private winston: any;
  requestId: string = '';
  client: string = '';
  constructor() {
    this.winston = winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [new winston.transports.Console()],
    });
  }

  setRequestId(requestId: string) {
    this.requestId = requestId;
  }

  setClient(client: string) {
    this.client = client
  }

  info(message: string, meta?: object | string) {
    const metaObj = typeof meta === 'string' ? { detail: meta } : meta;
    this.winston.info(message, { requestId: this.requestId, client: this.client, ...metaObj });
  }
  

  error(message: string, meta?: object | string) {
    const metaObj = typeof meta === 'string' ? { detail: meta } : meta;
    this.winston.error(message, { requestId: this.requestId, client: this.client, ...metaObj });
  }

  warn(message: string, meta?: object | string) {
    const metaObj = typeof meta === 'string' ? { detail: meta } : meta;
    this.winston.warn(message, { requestId: this.requestId, client: this.client, ...metaObj });
  }
}
