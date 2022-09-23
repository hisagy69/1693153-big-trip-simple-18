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
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
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
      update,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    this.#points = this.#points.filter((point) => point.id !== update.id);
    this._notify(updateType, update);
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
