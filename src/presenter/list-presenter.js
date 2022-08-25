import ListSortView from '../view/list-sort-view.js';
import TripPointEditView from '../view/trip-point-edit-view.js';
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

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  };

  #renderPoint = (point) => {
    const tripPointComponent = new TripPointView(point, this.#offers, this.#destinations);
    const tripEditComponent = new TripPointEditView(point, this.#offers, this.#destinations);

    const replaceCardToForm = () => {
      this.#tripPointsListComponent.element.replaceChild(tripEditComponent.element, tripPointComponent.element);
    };

    const replaceFormToCard = () => {
      this.#tripPointsListComponent.element.replaceChild(tripPointComponent.element, tripEditComponent.element);
    };

    const onCloseCard = () => {
      replaceFormToCard();
      document.removeEventListener('click', onCloseCard);
    };

    const onEscKeyDown = (event) => {
      if (event.key === 'Escape' || event.key === 'esc') {
        event.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
        document.removeEventListener('click', onCloseCard);
      }
    };

    tripPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    tripEditComponent.element.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
      document.removeEventListener('click', onCloseCard);
    });

    render(tripPointComponent, this.#tripPointsListComponent.element);
  };
}
