import AbstractView from '../framework/view/abstract-view';
import {TYPES} from '../const';
import {
  humanizePointTime,
  humanizePointDateDMY,
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
        ${TYPES.map((typeEvent) => (`<div class="event__type-item">
            <input id="event-type-${typeEvent}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeEvent}">
            <label class="event__type-label  event__type-label--${typeEvent}" for="event-type-${typeEvent}-1">${typeEvent}</label>
          </div>`)).join('')}
      </fieldset>
    </div>
  </div>`);

const createEventFieldDestinationTemplate = (destinations) => (`<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${TYPES[0]}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinations[0].name}" list="destination-list-1">
    <datalist id="destination-list-1">
      ${destinations.map((destination) => (`<option value="${destination.name}"></option>`)).join('')}
    </datalist>
  </div>`);

const createEventFieldTimeTemplate = () => {
  const dateNow = new Date;

  return (`<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizePointDateDMY(dateNow)} ${humanizePointTime(dateNow)}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizePointDateDMY(dateNow)} ${humanizePointTime(dateNow)}">
  </div>`);
};

const createEventFieldPriceTemplate = () => (`<div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
  </div>`);

const createEventAvailableOffersTemplate = (offers) => (`<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offers.length > 0 ? offers.map((offer) => (`<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
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

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${destination.pictures.map(({src, description}) => (`<img class="event__photo" src="${src}" alt="${description}">`)).join('')}
      </div>
    </div>
  </section>`);

const createTripPointAddTemplate = (offersByTypes, destinations) => {
  const {type, offers} = offersByTypes[0];

  const eventTypeTemplate = createEventTypeTemplate(type);
  const eventFieldDestination = createEventFieldDestinationTemplate(destinations);
  const eventFieldTime = createEventFieldTimeTemplate();
  const eventFieldPrice = createEventFieldPriceTemplate();
  const eventAvailableOffers = createEventAvailableOffersTemplate(offers);
  const eventSectionDestination = createEventSectionDestinationTemplate(destinations[0]);

  return (`<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${eventTypeTemplate}

        ${eventFieldDestination}

        ${eventFieldTime}

        ${eventFieldPrice}

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        ${eventAvailableOffers}

        ${eventSectionDestination}
      </section>
    </form>
  </li>`);
};

export default class TripPointAddView extends AbstractView {
  #offers = [];
  #destinations = [];

  constructor(offers, destinations) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createTripPointAddTemplate(this.#offers, this.#destinations);
  }
}
