import {createElement} from '../render';

const createLoadTemplate = () => ('<p class="trip-events__msg">Loading...</p>');

export default class LoadView {
  #element = null;

  get template() {
    return createLoadTemplate();
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
