import { parse } from 'graphql';
import { executor } from '../exectuor';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(__dirname, '../../data/addresses.json');

let originalData: string;

beforeAll(() => {
    originalData = fs.readFileSync(DATA_PATH, 'utf-8');
});

afterAll(() => {
    fs.writeFileSync(DATA_PATH, originalData);
});

describe('createAddress', () => {
    test('Success', async () => {
        const mutation = `
      mutation CreateAddress($username: String!, $address: AddressInput!) {
        createAddress(username: $username, address: $address) {
          street
          city
          zipcode
          state
        }
      }
    `;

        const variables = {
            username: 'testuser',
            address: {
                street: '123 Test Ave',
                city: 'Testville',
                zipcode: '99999',
                state: 'North State',
            },
        };

        const result = await executor({
            document: parse(mutation),
            variables,
        });

        expect(result).toEqual(
            expect.objectContaining({
                data: {
                    createAddress: {
                        street: '123 Test Ave',
                        city: 'Testville',
                        zipcode: '99999',
                        state: 'North State',
                    },
                },
            })
        );
    });

    test('Duplicate username error', async () => {
        const mutation = `
      mutation CreateAddress($username: String!, $address: AddressInput!) {
        createAddress(username: $username, address: $address) {
          street
          city
          zipcode
          state
        }
      }
    `;

        const variables = {
            username: 'testuser',
            address: {
                street: '456 Other St',
                city: 'Otherville',
                zipcode: '11111',
                state: 'South State',
            },
        };

        const result = await executor({
            document: parse(mutation),
            variables,
        });

        expect(result).toEqual(
            expect.objectContaining({
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        message: 'Address already exists for this username',
                    }),
                ]),
            })
        );
    });
});
