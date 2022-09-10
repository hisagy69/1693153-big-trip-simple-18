import {nanoid} from 'nanoid';

const generateIdArr = (n) => (Array.from({length: n}, nanoid));

const destinationsId = generateIdArr(10);
const offersId = generateIdArr(3);

export {generateIdArr, destinationsId, offersId};
