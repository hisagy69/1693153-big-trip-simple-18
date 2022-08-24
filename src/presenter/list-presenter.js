import ListSortView from '../view/list-sort-view.js';
import TripPointEditView from '../view/trip-point-edit-view.js';
import TripPointAddView from '../view/trip-point-add-view.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import TripPointView from '../view/trip-point-view.js';
import {render} from '../render.js';

export default class ListPresenter {
  #listSortComponent = new ListSortView();
  #tripPointsListComponent = new TripPointsListView();
  #listContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #points = [];
  #offers = [];
  #destinations = [];

  init = (listContainer, pointsModel, offersModel, destinationsModel) => {
    this.#listContainer = listContainer;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#points = this.#pointsModel.points;
    this.#offers = this.#offersModel.offers;
    this.#destinations = this.#destinationsModel.destinations;

    render(this.#listSortComponent, this.#listContainer);
    render(this.#tripPointsListComponent, this.#listContainer);
    render(new TripPointEditView(this.#points[0], this.#offers, this.#destinations), this.#tripPointsListComponent.element);
    render(new TripPointAddView(this.#offers, this.#destinations), this.#tripPointsListComponent.element);
    for (let i = 0; i < this.#points.length; i++) {
      render(new TripPointView(this.#points[i], this.#offers, this.#destinations), this.#tripPointsListComponent.element);
    }
  };
}
