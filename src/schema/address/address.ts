import fs from 'fs'
import { Address, Addresses, Args, CreateAddressArgs } from './types';
import { GraphQLError } from 'graphql';
import path from 'path'

const DATA_PATH = path.join(__dirname, '../../../data/addresses.json');

const readAddresses = (): Addresses => {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data)
}

const _getAddress = (username: string): Address | null => {
  const addresses = readAddresses();
  return addresses[username] ?? null;
};

export const getAddress = (_: any, args: Args, context: any): Address => {
  context.logger.info('getAddress', 'Enter resolver');
  const address = _getAddress(args.username);
  if (address) {
    context.logger.info('getAddress', 'Returning address');
    return address;
  }
  context.logger.error('getAddress', 'No address found');
  throw new GraphQLError('No address found in getAddress resolver');
};

export const createAddress = (_: any, args: CreateAddressArgs, context: any): Address => {
  context.logger.info('createAddress', 'Enter resolver');  
  const addresses = readAddresses();
  
  if (addresses[args.username]) {
    context.logger.error('createAddress', 'Address already exists');
    throw new GraphQLError('Address already exists for this username');
  }

  addresses[args.username] = args.address;
  fs.writeFileSync(DATA_PATH, JSON.stringify(addresses, null, 2));
  
  context.logger.info('createAddress', 'Address created');
  return args.address;
};
