import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {TYPES} from '../const';
import {
  humanizePointTime,
  humanizePointDateDMY,
  getOffersPointAvailable,
  getOffersByType,
  getDestination
} from '../utils/points';

const createEventTypeTemplate = (type) => (`<div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${TYPES.map((item) => (`
            <div class="event__type-item">
              <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
              <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${item}</label>
            </div>
          `)).join('')}
      </fieldset>
    </div>
  </div>`);

const createEventFieldDestinationTemplate = (destinations, type, destination) => (`<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
    <datalist id="destination-list-1">
      ${destinations.map((item) => (`<option value="${item.name}"></option>`)).join('')}}
    </datalist>
  </div>`);

const createEventFieldTimeTemplate = (dateFrom, dateTo) => (`<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizePointDateDMY(dateFrom)} ${humanizePointTime(dateFrom)}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizePointDateDMY(dateTo)} ${humanizePointTime(dateTo)}">
  </div>`);

const createEventFieldPriceTemplate = (basePrice) => (`<div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
  </div>`);

const createEventAvailableOffersTemplate = (offers, pointOffers) => (`<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offers.length > 0 ? offers.map((offer) => (`<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${pointOffers.find(({id}) => offer.id === id) ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-luggage-1">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`)).join('') : ''}
    </div>
  </section>`);

const createEventSectionDestinationTemplate = (destination) => (`<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
  </section>`);

const createTripPointEditTemplate = (data, destinations) => {
  const {dateFrom, dateTo, type, basePrice, destination, offers, offersByType} = data;
  const eventTypeTemplate = createEventTypeTemplate(type);
  const eventFieldDestination = createEventFieldDestinationTemplate(destinations, type, destination);
  const eventFieldTime = createEventFieldTimeTemplate(dateFrom, dateTo);
  const eventFieldPrice = createEventFieldPriceTemplate(basePrice);
  const eventAvailableOffers = createEventAvailableOffersTemplate(offersByType, offers);
  const eventSectionDestination = createEventSectionDestinationTemplate(destination);

  return (`<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${eventTypeTemplate}

        ${eventFieldDestination}

        ${eventFieldTime}

        ${eventFieldPrice}

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${eventAvailableOffers}

        ${eventSectionDestination}

      </section>
    </form>
  </li>`);
};

export default class TripPointEditView extends AbstractStatefulView {
  _state = null;
  #destinations = [];
  #offers = [];

  constructor(point, offers, destinations) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this._state = TripPointEditView.parsePointToState(point, offers, destinations);
    this.#setInnerHandlers();
  }

  get template() {
    return createTripPointEditTemplate(this._state, this.#destinations);
  }

  static parsePointToState = (point, offers, destinations) => {
    const offersByType = getOffersByType(offers, point.type);

    return {
      ...point,
      offers: getOffersPointAvailable(offersByType, point.offers),
      offersByType: offersByType,
      destination: getDestination(destinations, point.destination)
    };
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setEditClickHandler = (callback) => {
    this._callback.formClose = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
  };

  #formSubmitHandler = (event) => {
    event.preventDefault();
    this._callback.formSubmit();
  };

  #formCloseHandler = () => {
    this._callback.formClose();
  };

  #pointTypeHandler = (event) => {
    const typeInput = event.target.closest('.event__type-input');
    if (typeInput) {
      this.updateElement({
        type: typeInput.value,
        offers: [],
        offersByType: getOffersByType(this.#offers, typeInput.value)
      });
    }
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('click', this.#pointTypeHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.formClose);
  };
}
