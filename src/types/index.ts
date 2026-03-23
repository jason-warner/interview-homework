import { Logger } from '../logger';

export type ContextType = {
  request: Request;
  requestId: string;
  client: string;
  logger: Logger;
};
