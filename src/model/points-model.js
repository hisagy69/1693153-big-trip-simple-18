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

  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      this.#points[index],
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    this.#points = this.#points.filter((point) => point.id !== update.id);
    this._notify(updateType, update);
  };

  get points() {
    return this.#points;
  }
}
