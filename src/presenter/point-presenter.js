import TripPointEditView from '../view/trip-point-edit-view.js';
import TripPointView from '../view/trip-point-view.js';
import {replace, render, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITTING: 'EDITTING'
};

export default class PointPresenter {
  #offers = [];
  #destinations = [];
  #point = null;
  #tripPointComponent = null;
  #tripEditComponent = null;
  #listContainer = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;
  #changeData = null;

  constructor(listContainer, destinations, offers, changeData, changeMode) {
    this.#listContainer = listContainer;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#changeMode = changeMode;
    this.#changeData = changeData;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#tripPointComponent;
    this.#tripPointComponent = new TripPointView(this.#point, this.#offers, this.#destinations);
    this.#tripPointComponent.setClickHandler(this.#handleClickCard);

    if (prevPointComponent === null) {
      render(this.#tripPointComponent, this.#listContainer);
      return;
    }
    if (this.#mode === Mode.EDITTING) {
      this.#mode = Mode.DEFAULT;

      render(this.#tripPointComponent, this.#listContainer);
    }
    remove(prevPointComponent);
  }

  #replaceCardToForm = () => {
    this.#changeMode();
    this.#mode = Mode.EDITTING;
    replace(this.#tripEditComponent, this.#tripPointComponent);
  };

  #replaceFormToCard = () => {
    this.#mode = Mode.DEFAULT;
    replace(this.#tripPointComponent, this.#tripEditComponent);
    remove(this.#tripEditComponent);
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

  #addTripEditView = () => {
    this.#tripEditComponent = new TripPointEditView(this.#point, this.#offers, this.#destinations);
    this.#tripEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#tripEditComponent.setEditClickHandler(this.#handleEditClick);
    this.#tripEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleClickCard = () => {
    this.#addTripEditView();
    this.#replaceCardToForm();
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #handleFormSubmit = (point) => {
    const isMinorUpdate =
      this.#point.basePrice !== point.basePrice ||
      this.#point.dateFrom !== point.dateFrom;

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      point
    );
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
