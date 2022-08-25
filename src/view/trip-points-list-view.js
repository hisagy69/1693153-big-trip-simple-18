import {createElement} from '../render';

const createTripPointsListTemplate = () => ('<ul class="trip-events__list"></ul>');

export default class TripPointsListView {
  #element = null;

  get template() {
    return createTripPointsListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
