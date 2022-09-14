import PointPresenter from './point-presenter.js';
import ListSortView from '../view/list-sort-view.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import {render} from '../framework/render.js';
import {sortPriceUp, sortByDate} from '../utils/points.js';
import {SortType} from '../const.js';

export default class ListPresenter {
  #listSortComponent = new ListSortView(SortType.DAY);
  #tripPointsListComponent = new TripPointsListView();
  #listEmptyComponent = new ListEmptyView();
  #listContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #offers = [];
  #destinations = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  init = (listContainer, pointsModel, offersModel, destinationsModel) => {
    this.#listContainer = listContainer;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#offers = this.#offersModel.offers;
    this.#destinations = this.#destinationsModel.destinations;

    this.#listSortComponent.setSortChangeHandler(this.#handleSortTypeChange);

    this.#renderListSort();
    this.#renderPoints();
  };

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY :
        return sortByDate(this.#pointsModel.points);
      case SortType.PRICE :
        return sortPriceUp(this.#pointsModel.points);
    }
    return this.#pointsModel.points;
  }

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
    if (this.points.length > 0) {
      this.#renderPointsList();
      for (let i = 0; i < this.points.length; i++) {
        this.#renderPoint(this.points[i]);
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

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPoints();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };
}
