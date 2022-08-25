import {generatePoint} from '../mock/point';

export default class PointsModel {
  #points = Array.from({length: 10}, (_value, index) => generatePoint(index));

  get points() {
    return this.#points;
  }
}
