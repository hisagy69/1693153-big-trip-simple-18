import {generatePoint} from '../mock/point';
import {destinationsId} from '../mock/utils';
import Observable from '../framework/observable';

export default class PointsModel extends Observable{
  #points = Array.from(destinationsId, (id) => generatePoint(id));

  addPoint = (updateType, update) => {
    this.#points = [
      ...this.#points,
      update
    ];

    this._notify(updateType, update);
  };

  get points() {
    return this.#points;
  }
}
