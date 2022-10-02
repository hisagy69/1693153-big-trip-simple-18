import AbstractView from '../framework/view/abstract-view';

const createErrorLoadTemplate = () => ('<p class="trip-events__msg">Can\'t get response points</p>');

export default class ErrorLoadView extends AbstractView {
  get template() {
    return createErrorLoadTemplate();
  }
}
