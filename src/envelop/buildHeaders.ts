import type { Plugin } from '@envelop/core';
import { v4 as uuid } from 'uuid';
import { ContextType } from '../types';
import { GraphQLError } from 'graphql/error';

export const buildHeaders = (): Plugin<ContextType> => {
  return {
    onParse({ context, extendContext }) {
      const client = context.request?.headers.get('client');

      if (!client) {
        throw new GraphQLError('Missing required header: client');
      }

      const requestId = uuid();
      extendContext({ requestId, client });
    },
  };
};
