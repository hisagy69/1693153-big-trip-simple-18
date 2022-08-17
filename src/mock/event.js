import {TYPES} from '../const';
import {getRandomInteger} from '../utils';
import {generationDestination} from './destination';
import {offerGenerate} from './offer';

export const generateEvent = () => (
  {
    basePrice: 222,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: generationDestination(getRandomInteger(1, 3)),
    offers: Array.from({length: 3}, offerGenerate),
    type: getRandomInteger(0, TYPES.length)
  }
);
