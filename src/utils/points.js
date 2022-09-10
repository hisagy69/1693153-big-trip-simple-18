import dayjs from 'dayjs';
import {FilterType} from '../const';

const humanizePointDate = (dueDate) => dayjs(dueDate).format('MMMM D').toUpperCase();
const humanizePointDateNumber = (dueDate) => dayjs(dueDate).format('YYYY-MM-DD');
const humanizePointTime = (dueDate) => dayjs(dueDate).format('HH:mm');
const getPointDateRFC = (dueDate) => dayjs(dueDate).format('YYYY-MM-DDTHH:mm');
const humanizePointDateDMY = (dueDate) => dayjs(dueDate).format('DD/MM/YY');
const isPointExpired = (dueDate) => dayjs().isAfter(dueDate, 'D');
const isPointHasNotArrived = (date) => dayjs().isBefore(date, 'D');

const sortPriceUp = (points) => {
  points.sort((point1, point2) => (point2.basePrice - point1.basePrice));
};

const sortByDate = (points) => {
  points.sort((point1, point2) => dayjs(point2.dateFrom).diff(dayjs(point1.dateFrom)));
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointHasNotArrived(point.dateFrom))
};

const getOffersByType = (offers, type) => {
  const offersByType = offers.find((offer) => offer.type === type);
  return offersByType ? offersByType.offers : [];
};

const getOffersPointAvailable = (offers, offersPoint) => {
  return offers.filter((offer) => offersPoint.find((id) => offer.id === id));
};

const getDestination = (destinations, destination) => (destinations.find((item) => item.id === destination));

export {
  humanizePointDate,
  humanizePointDateNumber,
  humanizePointTime,
  getPointDateRFC,
  humanizePointDateDMY,
  isPointExpired,
  isPointHasNotArrived,
  filter,
  sortPriceUp,
  sortByDate,
  getOffersPointAvailable,
  getOffersByType,
  getDestination
};
