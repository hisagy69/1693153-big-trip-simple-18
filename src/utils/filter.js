import {FilterType} from '../const';
import {isPointHasNotArrived} from './points';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointHasNotArrived(point.dateFrom))
};

export {filter};
