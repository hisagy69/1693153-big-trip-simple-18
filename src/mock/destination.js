import {getRandomInteger} from '../utils';

const generateDestinationDescription = () => {
  const descriptions = [
    'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, its renowned for its skiing.',
    'Lorem ipsum'
  ];
  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generateDestinationName = () => {
  const names = [
    'Chamonix',
    'Amsterdam',
    'Geneva'
  ];
  const randomIndex = getRandomInteger(0, names.length - 1);

  return names[randomIndex];
};

const generateImageLink = () => (`http://picsum.photos/248/152?r=${Math.random()}`);

export const generateDestination = (id) => (
  {
    id,
    description: generateDestinationDescription(),
    name: generateDestinationName(),
    pictures: [
      {
        src: generateImageLink(),
        description: 'Chamonix parliament building'
      }
    ]
  }
);
