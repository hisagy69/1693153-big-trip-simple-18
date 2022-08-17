import {getRandomInteger} from '../utils';

const generateOfferTitle = () => {
  const titles = [
    'Upgrade to a business class',
    'Book tickets',
    'Lunch in city'
  ];
  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

export const offerGenerate = () => (
  {
    id: getRandomInteger(1, 3),
    title: generateOfferTitle(),
    price: getRandomInteger(200, 1500)
  }
);
