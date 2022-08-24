import {createElement} from '../render';
import {
  humanizePointDate,
  humanizePointDateNumber,
  humanizePointTime,
  getPointDateRFC,
  isPointExpired
} from '../utils';

const createPointTemplate = (point, offersTypes, destinations) => {
  const {dateFrom, dateTo, basePrice, type, id} = point;
  const destination = destinations.find((item) => item.id === id);
  const offersByType = offersTypes.find((offer) => offer.type === type);
  const offers = offersByType ? offersByType.offers : [];

  return (`<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${humanizePointDateNumber(dateFrom)}">${humanizePointDate(dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${getPointDateRFC(dateFrom)}">${humanizePointTime(dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${getPointDateRFC(dateTo)}">${humanizePointTime(dateTo)}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offers.length > 0 ? offers.map((offer) => (`<li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>`)).join('') : `<li class="event__offer">
            <span class="event__offer-title">No additional offers</span>
          </li>`}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">
          ${isPointExpired ? 'Open' : 'Close'} event
        </span>
      </button>
    </div>
  </li>`);
};

export default class TripPointView {
  #element = null;
  #point = null;
  #offers = [];
  #destinations = [];

  constructor(point, offers, destinations) {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destinations);
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
