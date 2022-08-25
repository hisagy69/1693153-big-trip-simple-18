import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomValue = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);
  return arr[randomIndex];
};

const humanizePointDate = (dueDate) => dayjs(dueDate).format('MMMM D').toUpperCase();
const humanizePointDateNumber = (dueDate) => dayjs(dueDate).format('YYYY-MM-DD');
const humanizePointTime = (dueDate) => dayjs(dueDate).format('HH:mm');
const getPointDateRFC = (dueDate) => dayjs(dueDate).format('YYYY-MM-DDTHH:mm');
const humanizePointDateDMY = (dueDate) => dayjs(dueDate).format('DD/MM/YY');
const isPointExpired = (dueDate) => dayjs().isAfter(dueDate, 'D');

export {
  getRandomInteger,
  getRandomValue,
  humanizePointDate,
  humanizePointDateNumber,
  humanizePointTime,
  getPointDateRFC,
  humanizePointDateDMY,
  isPointExpired
};
