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

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#tripPointComponent;
    this.#tripPointComponent = new TripPointView(this.#point, this.#offers, this.#destinations);
    this.#tripPointComponent.setClickHandler(this.#handleClickCard);

    if (!prevPointComponent) {
      render(this.#tripPointComponent, this.#listContainer);
      remove(prevPointComponent);
      return;
    }

    replace(this.#tripPointComponent, prevPointComponent);
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITTING) {
      this.#tripEditComponent.updateElement({
        isSaving: true,
        isDisabled: true
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITTING) {
      this.#tripEditComponent.updateElement({
        isDeleting: true,
        isDisabled: true
      });
    }
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#tripEditComponent.updateElement({
        isSaving: false,
        isDeleting: false,
        isDisabled: false
      });
    };

    this.#tripEditComponent.shake(resetFormState);
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

  #addTripEditView = () => {
    this.#tripEditComponent = new TripPointEditView(this.#offers, this.#destinations, this.#point);
    this.#tripEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#tripEditComponent.setEditClickHandler(this.#handleEditClick);
    this.#tripEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
  };

  #handleEditClick = () => {
    this.#replaceFormToCard();
    document.removeEventListener('keydown', this.#onEscKeyDown);
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
  };

  #onEscKeyDown = (event) => {
    if (event.key === 'Escape' || event.key === 'esc') {
      event.preventDefault();
      this.#replaceFormToCard();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}
