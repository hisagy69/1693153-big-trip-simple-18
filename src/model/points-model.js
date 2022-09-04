import {generatePoint} from '../mock/point';
import {destinationsId} from '../mock/utils';

export default class PointsModel {
  #points = Array.from(destinationsId, (id) => generatePoint(id));

  get points() {
    return this.#points;
  }
}
