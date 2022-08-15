import {createElement} from '../render';

const createTripEventsListTemplate = () => ('<ul class="trip-events__list">');

export default class TripEventsListView {
  getTemplate() {
    return createTripEventsListTemplate();
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
