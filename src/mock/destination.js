import {getRandomValue} from '../utils/common';
import {destinationsId} from './utils';

const descriptions = [
  'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
  'Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, its renowned for its skiing.',
  'Lorem ipsum'
];

const names = [
  'Chamonix',
  'Amsterdam',
  'Geneva'
];

const generateImageLink = () => (
  {
    src: `http://picsum.photos/248/152?r=${Math.random()}`,
    description: 'lorem ipsum'
  }
);

export const generateDestination = (i) => (
  {
    id: destinationsId[i],
    description: getRandomValue(descriptions),
    name: getRandomValue(names),
    pictures: Array.from({length: 5}, generateImageLink)
  }
);
