import { type DriverTypeParser } from '@slonik/driver';

const timestampParser = (value: null | string) => {
  if (value === 'infinity') {
    return Number.POSITIVE_INFINITY;
  }

  if (value === '-infinity') {
    return Number.NEGATIVE_INFINITY;
  }

  return value === null ? value : new Date(value + 'Z');
};

export const createTimestampTypeParser = (): DriverTypeParser => {
  return {
    name: 'timestamp',
    parse: timestampParser,
  };
};
