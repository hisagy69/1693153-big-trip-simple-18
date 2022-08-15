import {createElement} from '../render';

const createListEmptyTemplate = () => ('<p class="trip-events__msg">Click New Event to create your first point</p>');

export default class ListEmtyView {
  getTemplate() {
    return createListEmptyTemplate();
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
