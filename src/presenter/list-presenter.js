import PointPresenter from './point-presenter.js';
import ListSortView from '../view/list-sort-view.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import {render} from '../framework/render.js';

export default class ListPresenter {
  #listSortComponent = new ListSortView();
  #tripPointsListComponent = new TripPointsListView();
  #listEmptyComponent = new ListEmptyView();
  #listContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #offers = [];
  #destinations = [];
  #points = [];
  #pointPresenter = new Map();

  init = (listContainer, pointsModel, offersModel, destinationsModel) => {
    this.#listContainer = listContainer;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#points = this.#pointsModel.points;
    this.#offers = this.#offersModel.offers;
    this.#destinations = this.#destinationsModel.destinations;

    this.#renderListSort();
    this.#renderPoints();
  };

  #renderListSort = () => {
    render(this.#listSortComponent, this.#listContainer);
  };

  #renderPointsList = () => {
    render(this.#tripPointsListComponent, this.#listContainer);
  };

  #renderListEmpty = () => {
    render(this.#listEmptyComponent, this.#listContainer);
  };

  #renderPoints = () => {
    if (this.#points.length > 0) {
      this.#renderPointsList();
      for (let i = 0; i < this.#points.length; i++) {
        this.#renderPoint(this.#points[i]);
      }
    } else {
      this.#renderListEmpty();
    }
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripPointsListComponent.element, this.#destinations, this.#offers, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };
}
