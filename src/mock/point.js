import {TYPES} from '../const';
import {nanoid} from 'nanoid';
import {getRandomValue, getRandomInteger} from '../utils/common';
import {offersId} from './utils';

export const generatePoint = (destinationId) => (
  {
    id: nanoid(),
    basePrice: getRandomInteger(100, 3000),
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: destinationId,
    offers: offersId,
    type: getRandomValue(TYPES)
  }
);
