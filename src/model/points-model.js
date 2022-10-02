import Observable from '../framework/observable';
import {UpdateType} from '../const';

export default class PointsModel extends Observable{
  #points = [];
  #pointApiService = null;
  #offers = [];
  #destinations = [];

  constructor(pointApiService) {
    super();
    this.#pointApiService = pointApiService;
  }

  init = async () => {
    try {
      const points = await this.#pointApiService.points;
      this.#points = points.map(this.#adaptToClient);
      this.#destinations = await this.#pointApiService.destinations;
      this.#offers = await this.#pointApiService.offers;
    } catch (err) {
      this._notify(UpdateType.ERROR);
      throw new Error('Can\'t get response points');
    }

    this._notify(UpdateType.INIT);
  };

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations(){
    return this.#destinations;
  }

  addPoint = async (updateType, update) => {
    try {
      const response = await this.#pointApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points,
        update
      ];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }

  };

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    try {
      const response = await this.#pointApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  };

  deletePoint = async (updateType, update) => {
    try {
      await this.#pointApiService.deletePoint(update);
      this.#points = this.#points.filter((point) => point.id !== update.id);
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };
}
