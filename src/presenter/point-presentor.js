import TripPointEditView from '../view/trip-point-edit-view.js';
import TripPointView from '../view/trip-point-view.js';
import {replace, render} from '../framework/render.js';
export default class PointPresentor {
  #offers = [];
  #offersAll = [];
  #destinations = [];
  #point = null;
  #destination = null;
  #offersByType = null;
  #tripPointComponent = null;
  #tripEditComponent = null;
  #listContainer = null;

  constructor(listContainer, destinations, offersAll) {
    this.#listContainer = listContainer;
    this.#destinations = destinations;
    this.#offersAll = offersAll;
  }

  init(point) {
    this.#point = point;
    this.#destination = this.#destinations.find((item) => item.id === point.id);
    this.#offersByType = this.#offersAll.find((item) => item.type === point.type);
    this.#offers = this.#offersByType ? this.#offersByType.offers : [];

    this.#tripPointComponent = new TripPointView(this.#point, this.#offers, this.#destination);
    this.#tripEditComponent = new TripPointEditView(this.#point, this.#offers, this.#destination, this.#destinations);

    this.#tripPointComponent.setClickHandler(this.#handleClickCard);
    this.#tripEditComponent.setEditClickHandler(this.#handleEditClick);
    this.#tripEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    render(this.#tripPointComponent, this.#listContainer);
  }

  #replaceCardToForm = () => {
    replace(this.#tripEditComponent, this.#tripPointComponent);
  };

  #replaceFormToCard = () => {
    replace(this.#tripPointComponent, this.#tripEditComponent);
  };

  #onEscKeyDown = (event) => {
    if (event.key === 'Escape' || event.key === 'esc') {
      event.preventDefault();
      this.#replaceFormToCard();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #handleEditClick = () => {
    this.#replaceFormToCard();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #handleClickCard = () => {
    this.#replaceCardToForm();
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };
}
