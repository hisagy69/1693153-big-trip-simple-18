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
    const prevEditComponent = this.#tripEditComponent;

    this.#tripPointComponent = new TripPointView(this.#point, this.#offers, this.#destinations);

    this.#tripPointComponent.setClickHandler(this.#handleClickCard);

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
    this.#tripEditComponent.setEditClickHandler(this.#handleEditClick);
    this.#tripEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#tripEditComponent.setDeletePointClickHandler(this.#handleDeleteCard)
  };

  #handleDeleteCard = () => {

  };

  #handleClickCard = () => {
    this.#addTripEditView();
    this.#replaceCardToForm();
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #handleFormSubmit = (point) => {
    this.#replaceFormToCard();
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point
    );
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
