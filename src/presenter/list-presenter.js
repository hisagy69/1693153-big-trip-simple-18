import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';
import ListSortView from '../view/list-sort-view.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import LoadView from '../view/load-view';
import ErrorLoadView from '../view/error-load-view';
import {remove, render, replace, RenderPosition} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import {sortPriceUp, sortByDate, filter} from '../utils/points.js';
import {FilterType, SortType} from '../const.js';
import {UserAction, UpdateType} from '../const.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export default class ListPresenter {
  #listSortComponent = null;
  #tripPointsListComponent = null;
  #listEmptyComponent = null;
  #loadComponent = new LoadView();
  #errorLoadComponent = null;
  #isLoading = true;

  #listContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #filterPoints = [];
  #pointNewPresenter = null;

  #pointPresenter = new Map();
  #currentSortType = SortType.DAY;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(listContainer, pointsModel, filterModel) {
    this.#listContainer = listContainer;

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#renderPointsList();
    this.#pointNewPresenter = new PointNewPresenter(
      this.#tripPointsListComponent.element,
      this.#pointsModel,
      this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

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

  init = () => {
    this.#renderBoard();
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback);
  };

  #renderLoading = () => {
    render(this.#loadComponent, this.#listContainer);
  };

  #renderErrorLoad = () => {
    render(this.#errorLoadComponent, this.#listContainer);
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
    const pointPresenter = new PointPresenter(
      this.#tripPointsListComponent.element,
      this.#pointsModel.destinations,
      this.#pointsModel.offers,
      this.#handleViewAction,
      this.#handleModeChange);

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT :
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT :
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT :
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
      case UpdateType.ERROR :
        this.#isLoading = false;
        remove(this.#loadComponent);
        this.#errorLoadComponent = new ErrorLoadView();
        this.#renderErrorLoad();
        break;
    }
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
}
