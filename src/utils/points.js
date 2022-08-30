import dayjs from 'dayjs';

const humanizePointDate = (dueDate) => dayjs(dueDate).format('MMMM D').toUpperCase();
const humanizePointDateNumber = (dueDate) => dayjs(dueDate).format('YYYY-MM-DD');
const humanizePointTime = (dueDate) => dayjs(dueDate).format('HH:mm');
const getPointDateRFC = (dueDate) => dayjs(dueDate).format('YYYY-MM-DDTHH:mm');
const humanizePointDateDMY = (dueDate) => dayjs(dueDate).format('DD/MM/YY');
const isPointExpired = (dueDate) => dayjs().isAfter(dueDate, 'D');
const isPointHasNotArrived = (date) => dayjs().isBefore(date, 'D');

export {
  humanizePointDate,
  humanizePointDateNumber,
  humanizePointTime,
  getPointDateRFC,
  humanizePointDateDMY,
  isPointExpired,
  isPointHasNotArrived
};
