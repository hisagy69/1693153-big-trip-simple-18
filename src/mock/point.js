import {TYPES} from '../const';
import {nanoid} from 'nanoid';
import {getRandomValue, getRandomInteger} from '../utils/common';
import {offersId} from './utils';
import randomDate from '@js-random/date';

export const generatePoint = (destinationId) => (
  {
    id: nanoid(),
    basePrice: getRandomInteger(100, 3000),
    dateFrom: randomDate(),
    dateTo: randomDate(),
    destination: destinationId,
    offers: offersId,
    type: getRandomValue(TYPES)
  }
);
