import {remove, render, RenderPosition} from '../framework/render';
import TripPointEditView from '../view/trip-point-edit-view';
import {UpdateType, UserAction} from '../const';

export default class PointNewPresenter {
  #listContainer = null;
  #changeData = null;
  #tripEditComponent = null;
  #destroyCallback = null;
  #pointsModel = null;

  constructor(listContainer, pointsModel, changeData) {
    this.#listContainer = listContainer;
    this.#changeData = changeData;

    this.#pointsModel = pointsModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#tripEditComponent !== null) {
      return;
    }
    this.#tripEditComponent = new TripPointEditView(this.#pointsModel.offers, this.#pointsModel.destinations);
    this.#tripEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#tripEditComponent.setEditClickHandler(this.#handleClose);
    this.#tripEditComponent.setDeleteClickHandler(this.#handleClose);

    render(this.#tripEditComponent, this.#listContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleClose = () => {
    this.destroy();
  };

  destroy = () => {
    if (this.#tripEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    remove(this.#tripEditComponent);
    this.#tripEditComponent = null;
  };

  #escKeyDownHandler = (event) => {
    if (event.key === 'Esc' || event.key === 'Escape') {
      event.preventDefault();
      this.destroy();
    }
  };
}
