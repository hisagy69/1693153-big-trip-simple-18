import AbstractView from '../framework/view/abstract-view';

const createLoadTemplate = () => ('<p class="trip-events__msg">Loading...</p>');

export default class LoadView extends AbstractView {
  get template() {
    return createLoadTemplate();
  }
}
