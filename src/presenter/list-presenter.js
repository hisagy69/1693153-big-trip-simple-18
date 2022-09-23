import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';
import ListSortView from '../view/list-sort-view.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import LoadView from '../view/load-view';
import {remove, render, replace, RenderPosition} from '../framework/render.js';
import {sortPriceUp, sortByDate, filter} from '../utils/points.js';
import {FilterType, SortType} from '../const.js';
import {UserAction, UpdateType} from '../const.js';

export default class ListPresenter {
  #listSortComponent = null;
  #tripPointsListComponent = null;
  #listEmptyComponent = null;
  #loadComponent = new LoadView();
  #isLoading = true;

  #listContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #filterPoints = [];
  #pointNewPresenter = null;

  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor(listContainer, pointsModel, filterModel) {
    this.#listContainer = listContainer;

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#renderPointsList();
    this.#pointNewPresenter = new PointNewPresenter(this.#tripPointsListComponent.element, this.#pointsModel, this.#handleViewAction);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderBoard();
  };

  get points() {
    this.#filterPoints = filter[this.#filterModel.filter](this.#pointsModel.points);
    switch (this.#currentSortType) {
      case SortType.DAY :
        return sortByDate(this.#filterPoints);
      case SortType.PRICE :
        return sortPriceUp(this.#filterPoints);
    }
    return this.#filterPoints;
  }

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback);
  };

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
        this.#renderBoard();
        break;
      case UpdateType.MAJOR :
        this.#clearPointList(true);
        this.#renderBoard();
        break;
      case UpdateType.INIT :
        this.#isLoading = false;
        remove(this.#loadComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderLoading = () => {
    render(this.#loadComponent, this.#listContainer);
  };

  #renderListSort = () => {
    this.#listSortComponent = new ListSortView(this.#currentSortType);
    render(this.#listSortComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
    this.#listSortComponent.setSortChangeHandler(this.#handleSortTypeChange);
  };

  #resetSort = () => {
    const prevSortComponent = this.#listSortComponent;
    this.#listSortComponent = new ListSortView(this.#currentSortType);
    replace(this.#listSortComponent, prevSortComponent);
    this.#listSortComponent.setSortChangeHandler(this.#handleSortTypeChange);
    remove(prevSortComponent);
  };

  #renderPointsList = () => {
    this.#tripPointsListComponent = new TripPointsListView();
    render(this.#tripPointsListComponent, this.#listContainer);
  };

  #renderListEmpty = () => {
    remove(this.#loadComponent);
    remove(this.#listSortComponent);
    remove(this.#tripPointsListComponent);
    this.#listEmptyComponent = new ListEmptyView(this.#filterModel.filter);
    render(this.#listEmptyComponent, this.#listContainer);
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (!this.#listSortComponent) {
      this.#renderListSort();
    }
    if (this.points.length > 0) {
      this.points.forEach((point) => this.#renderPoint(point));
    } else {
      this.#renderListEmpty();
    }
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripPointsListComponent.element, this.#pointsModel.destinations, this.#pointsModel.offers, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #handleSortTypeChange = (sortType) => {
    if (sortType !== this.#currentSortType) {
      this.#currentSortType = sortType;
      this.#clearPointList();
      this.#renderBoard();
    }
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearPointList = (resetSortType = false) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    if (this.#listEmptyComponent) {
      remove(this.#listEmptyComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
      this.#resetSort();
    }
  };
}
