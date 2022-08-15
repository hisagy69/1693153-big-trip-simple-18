import {createElement} from '../render';

const createLoadTemplate = () => ('<p class="trip-events__msg">Loading...</p>');

export default class LoadView {
  getTemplate() {
    return createLoadTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
