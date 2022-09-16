import PointPresenter from './point-presenter.js';
import ListSortView from '../view/list-sort-view.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import {remove, render} from '../framework/render.js';
import {sortPriceUp, sortByDate} from '../utils/points.js';
import {SortType} from '../const.js';
import {UserAction, UpdateType} from '../const.js';

export default class ListPresenter {
  #listSortComponent = null;
  #tripPointsListComponent = new TripPointsListView();
  #listEmptyComponent = new ListEmptyView();

  #changeData = null;
  #listContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #offers = [];
  #destinations = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(changeData) {
    this.#changeData = changeData;
  }

  init = (listContainer, pointsModel, offersModel, destinationsModel) => {
    this.#listContainer = listContainer;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#offers = this.#offersModel.offers;
    this.#destinations = this.#destinationsModel.destinations;

    this.#pointsModel.addObserver(this.#handleModelEvent);

    this.#renderListSort();

    this.#listSortComponent.setSortChangeHandler(this.#handleSortTypeChange);

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

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT :
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT :
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT :
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH :
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR :
        this.#clearPointList();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR :
        this.#clearPointList(true);
        this.#renderPoints();
        break;
    }
  };

  #renderListSort = () => {
    this.#listSortComponent = new ListSortView(SortType.DAY)
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
      this.points.forEach((point) => this.#renderPoint(point));
    } else {
      this.#renderListEmpty();
    }
    this.#renderListSort();
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripPointsListComponent.element, this.#destinations, this.#offers, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointList(true);
    this.#renderPoints();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleArchiveClick = (id) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      this.points.filter((point) => point.id !== id)
    );
  };

  #clearPointList = (resetSortType = false) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#listSortComponent);
    remove(this.#listEmptyComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY
    }
  };
}
