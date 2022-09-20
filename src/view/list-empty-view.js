import AbstractView from '../framework/view/abstract-view';
import {FilterType} from '../const';

const createListEmptyTemplate = (filter) => {
  const text = filter === FilterType.EVERYTHING ?
    'Click New Event to create your first point' :
    'There are no future events now';
  return `<p class="trip-events__msg">${text}</p>`;
};


export default class ListEmptyView extends AbstractView {
  #filter = null;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createListEmptyTemplate(this.#filter);
  }
}
