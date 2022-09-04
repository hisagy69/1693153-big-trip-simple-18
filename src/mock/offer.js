import {getRandomInteger, getRandomValue} from '../utils/common';
import {offersId} from './utils';
import {TYPES} from '../const';

const titles = [
  'Upgrade to a business class',
  'Choose the radio station',
  'Choose temperature',
  'Book a taxi at the arrival point',
  'Order a breakfast',
  'Wake up at a certain time',
  'Choose meal',
  'Upgrade to comfort class'
];

const generateOffer = (i) => (
  {
    id: offersId[i],
    title: getRandomValue(titles),
    price: getRandomInteger(100, 300)
  }
);

export const generateOffersType = (index) => (
  {
    type: TYPES[index],
    offers: Array.from({length: 3}, (_value, i) => generateOffer(i))
  }
);
