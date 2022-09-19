import AbstractView from '../framework/view/abstract-view';

const createPointAddButtonTemplate = () => (
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
);

export default class PointAddButtonView extends AbstractView {
  get template() {
    return createPointAddButtonTemplate();
  }

  setClickHandler = (calback) => {
    this._callback.addPointButton = calback;
    this.element.addEventListener('click', this.#addPointClickHandler);
  };

  #addPointClickHandler = (event) => {
    event.preventDefault();
    this._callback.addPointButton();
  };
}
