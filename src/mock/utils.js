import {nanoid} from 'nanoid';
import {getRandomInteger} from '../utils/common';

const generateIdArr = (n) => (Array.from({length: n}, nanoid));

const generateIdArrRandomLength = () => {
  const numberOfOffers = getRandomInteger(0, 2);
  return numberOfOffers ?
    generateIdArr(numberOfOffers) :
    [];
};

const destinationsId = generateIdArr(10);
const offersId = generateIdArrRandomLength();

export {generateIdArr, destinationsId, offersId};
