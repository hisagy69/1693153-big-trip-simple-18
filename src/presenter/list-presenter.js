import ListSortView from '../view/list-sort-view.js';
import TripPointEditView from '../view/trip-point-edit-view.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import TripPointView from '../view/trip-point-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import {render, replace} from '../framework/render.js';

export default class ListPresenter {
  #listSortComponent = new ListSortView();
  #tripPointsListComponent = new TripPointsListView();
  #listEmptyComponent = new ListEmptyView();
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

    if (this.#points.length > 0) {
      render(this.#tripPointsListComponent, this.#listContainer);
      for (let i = 0; i < this.#points.length; i++) {
        this.#renderPoint(this.#points[i]);
      }
    } else {
      render(this.#listEmptyComponent, this.#listContainer);
    }
  };

  #renderPoint = (point) => {
    const destination = this.#destinations.find((item) => item.id === point.id);
    const offersByType = this.#offers.find((item) => item.type === point.type);
    const offers = offersByType ? offersByType.offers : [];
    const tripPointComponent = new TripPointView(point, offers, destination);
    const tripEditComponent = new TripPointEditView(point, offers, destination, this.#destinations);

    const replaceCardToForm = () => {
      replace(tripEditComponent, tripPointComponent);
    };

    const replaceFormToCard = () => {
      replace(tripPointComponent, tripEditComponent);
    };

    const onEscKeyDown = (event) => {
      if (event.key === 'Escape' || event.key === 'esc') {
        event.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    tripPointComponent.setClickHandler(() => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    tripEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    tripEditComponent.setEditClickHandler(() => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(tripPointComponent, this.#tripPointsListComponent.element);
  };
}
