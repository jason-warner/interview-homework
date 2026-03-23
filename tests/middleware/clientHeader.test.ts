import { parse } from 'graphql';
import { createYoga } from 'graphql-yoga';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import { genSchema } from '../../src/schema';
import plugins from '../../src/envelop/index';

const schema = genSchema();
const yoga = createYoga({ schema, plugins });

const executorNoClient = buildHTTPExecutor({ fetch: yoga.fetch });
const executorWithClient = buildHTTPExecutor({
  fetch: yoga.fetch,
  headers: { client: 'test client' },
});

const query = `
  query GetAddress($username: String!) {
    address(username: $username) {
      street
      city
      zipcode
      state
    }
  }
`;

describe('Middleware', () => {
  test('Missing client header returns error', async () => {
    const result = await executorNoClient({
      document: parse(query),
      variables: { username: 'jack' },
    });

    expect(result).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: 'Missing required header: client',
          }),
        ]),
      })
    );
  });

  test('Response contains requestId in extensions', async () => {
    const result = await executorWithClient({
      document: parse(query),
      variables: { username: 'jack' },
    });

    expect((result as any).extensions?.metadata?.requestId).toBeDefined();
  });
});
