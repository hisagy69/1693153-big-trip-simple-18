import AbstractView from '../framework/view/abstract-view';

const createTripPointsListTemplate = () => ('<ul class="trip-events__list"></ul>');

export default class TripPointsListView extends AbstractView {
  get template() {
    return createTripPointsListTemplate();
  }
}
