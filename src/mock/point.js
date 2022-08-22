import {TYPES} from '../const';
import {getRandomValue, getRandomInteger} from '../utils';

const generateOffersId = () => {
  const numberOfOffers = getRandomInteger(0, 2);
  return numberOfOffers ?
    Array.from({length: numberOfOffers}, () => getRandomInteger(1, 3)) :
    [];
};

export const generatePoint = (index) => (
  {
    id: index + 1,
    basePrice: getRandomInteger(100, 3000),
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: index + 1,
    offers: generateOffersId(),
    type: getRandomValue(TYPES)
  }
);
