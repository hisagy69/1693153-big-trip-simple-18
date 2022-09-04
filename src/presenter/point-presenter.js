import TripPointEditView from '../view/trip-point-edit-view.js';
import TripPointView from '../view/trip-point-view.js';
import {replace, render, remove} from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITTING: 'EDITTING'
};

export default class PointPresenter {
  #offers = [];
  #offersAll = [];
  #destinations = [];
  #point = null;
  #destination = null;
  #offersByType = null;
  #tripPointComponent = null;
  #tripEditComponent = null;
  #listContainer = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  constructor(listContainer, destinations, offersAll, changeMode) {
    this.#listContainer = listContainer;
    this.#destinations = destinations;
    this.#offersAll = offersAll;
    this.#changeMode = changeMode;
  }

  init(point) {
    this.#point = point;
    this.#destination = this.#destinations.find((item) => item.id === point.destination);

    this.#offersByType = this.#offersAll.find((item) => item.type === point.type);
    this.#offers = this.#offersByType ? this.#offersByType.offers : [];

    const prevPointComponent = this.#tripPointComponent;
    const prevEditComponent = this.#tripEditComponent;

    this.#tripPointComponent = new TripPointView(this.#point, this.#offers, this.#destination);
    this.#tripEditComponent = new TripPointEditView(this.#point, this.#offers, this.#destination, this.#destinations);

    this.#tripPointComponent.setClickHandler(this.#handleClickCard);
    this.#tripEditComponent.setEditClickHandler(this.#handleEditClick);
    this.#tripEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this.#tripPointComponent, this.#listContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripEditComponent, this.#tripPointComponent);
    }

    if (this.#mode === Mode.EDITTING) {
      replace(this.#tripPointComponent, this.#tripEditComponent);
    }

    remove(prevPointComponent);
    remove(prevEditComponent);
  }

  #replaceCardToForm = () => {
    this.#changeMode();
    this.#mode = Mode.EDITTING;
    replace(this.#tripEditComponent, this.#tripPointComponent);
  };

  #replaceFormToCard = () => {
    this.#mode = Mode.DEFAULT;
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

  resetView = () => {
    if (this.#mode === Mode.EDITTING) {
      this.#replaceFormToCard();
    }
  };

  destroy = () => {
    remove(this.#tripPointComponent);
    remove(this.#tripEditComponent);
  };
}
