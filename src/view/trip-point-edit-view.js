import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {
  getOffersPointSelected,
  getOffersByType,
  getDestination,
  humanizePointTime,
  humanizePointDateDMY
} from '../utils/points';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';

const Mode = {
  ADDING: 'ADDING',
  EDITTING: 'EDITTING'
};

const createEventTypeTemplate = (type, offers, isDisabled) => (`<div class="event__type-wrapper">
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${offers.map((offer) => (`
            <div class="event__type-item">
              <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}">
              <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${offer.type}</label>
            </div>
          `)).join('')}
      </fieldset>
    </div>
  </div>`);

const createEventFieldDestinationTemplate = (destinations, type, destination, isDisabled) => (`<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${type}
    </label>
    <input
      class="event__input  event__input--destination"
      id="event-destination-1"
      type="text"
      name="event-destination"
      value="${destination?.name || ''}"
      list="destination-list-1"
      ${isDisabled ? 'disabled' : ''}>
    <datalist id="destination-list-1">
      ${destinations.map((item) => (`<option value="${item.name}"></option>`)).join('')}
    </datalist>
  </div>`);

const createEventFieldTimeTemplate = (dateFrom, dateTo, isDisabled) => (`<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizePointDateDMY(dateFrom)} ${humanizePointTime(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizePointDateDMY(dateTo)} ${humanizePointTime(dateTo)}" ${isDisabled ? 'disabled' : ''}>
  </div>`);

const createEventFieldPriceTemplate = (basePrice, isDisabled) => (`<div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
  </div>`);

const createEventAvailableOffersTemplate = (offers, pointOffers, isDisabled) => (`<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offers.map((offer) => (`<div class="event__offer-selector">
            <input
              class="event__offer-checkbox  visually-hidden"
              id="event-offer-luggage-1"
              type="checkbox"
              name="event-offer-luggage"
              ${pointOffers?.find(({id}) => offer.id === id) ? 'checked' : ''}
              ${isDisabled ? 'disabled' : ''}>
            <label class="event__offer-label" for="event-offer-luggage-1" data-offer-id="${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`)).join('')}
    </div>
  </section>`);

const createEventSectionDestinationTemplate = (destination) => (`<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${destination?.description.length ? `<p class="event__destination-description">${destination.description}</p>` : ''}
    ${destination?.pictures.length ? `<div class="event__photos-container">
          <div class="event__photos-tape">
            ${destination.pictures.map(({src, description}) => (`<img class="event__photo" src="${src}" alt="${description}">`)).join('')}
          </div>
        </div>` : ''}
  </section>`);

const createTripPointEditTemplate = (destinations, offersAll, data, mode) => {
  const {
    dateFrom,
    dateTo,
    type,
    basePrice,
    destination,
    offers,
    offersByType,
    isDisabled,
    isSaving,
    isDeleting
  } = data;

  const eventTypeTemplate = createEventTypeTemplate(type, offersAll, isDisabled);
  const eventFieldDestination = createEventFieldDestinationTemplate(destinations, type, destination, isDisabled);
  const eventFieldTime = createEventFieldTimeTemplate(dateFrom, dateTo, isDisabled);
  const eventFieldPrice = createEventFieldPriceTemplate(basePrice, isDisabled);
  const eventAvailableOffers = offersByType.length ? createEventAvailableOffersTemplate(offersByType, offers, isDisabled) : '';
  const eventSectionDestination = createEventSectionDestinationTemplate(destination);
  const deleteTextButton = isDeleting ? 'Deleting...' : 'Delete';

  return (`<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${eventTypeTemplate}

        ${eventFieldDestination}

        ${eventFieldTime}

        ${eventFieldPrice}

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${mode === Mode.EDITTING ? deleteTextButton : 'Cancel'}</button>
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
  #destinations = [];
  #offers = [];
  #datepickerFrom = null;
  #datepickerTo = null;
  #mode = null;

  constructor(offers, destinations, point) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this._setState(TripPointEditView.parsePointToState(offers, destinations, point));
    this.#mode = point ? Mode.EDITTING : Mode.ADDING;
    this.#setInnerHandlers();
  }

  get template() {
    return createTripPointEditTemplate(this.#destinations, this.#offers, this._state, this.#mode);
  }

  static parsePointToState = (offers, destinations, point) => {
    if (point) {
      const offersByType = getOffersByType(offers, point.type);

      return {
        ...point,
        offers: getOffersPointSelected(offersByType, point.offers),
        offersByType: offersByType,
        destination: getDestination(destinations, point.destination),
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      };
    }
    const date = Date.now();

    return {
      offers: [],
      type: offers[0].type,
      offersByType: offers[0].offers,
      basePrice: 0,
      dateFrom: date,
      dateTo: date
    };
  };

  static parseStateToPoint = (state) => {
    const data = {
      ...state,
      offers: state.offers.map((offer) => offer?.id),
      destination: state.destination?.id
    };

    delete data.offersByType;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setEditClickHandler = (callback) => {
    this._callback.formClose = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deletePointHandler);
  };

  #formSubmitHandler = (event) => {
    event.preventDefault();
    this._callback.formSubmit(TripPointEditView.parseStateToPoint(this._state));
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

  #pointOfferHandler = (event) => {
    const label = event.target.closest('label');
    if (label) {
      event.preventDefault();
      const selectedOffer = this._state.offersByType.find((offer) => offer.id === +label.dataset.offerId);
      const checkbox = label.parentNode.querySelector('input');
      if (!checkbox.checked) {
        this._setState({
          offers: [...this._state.offers, selectedOffer]
        });
        checkbox.checked = true;
      } else {
        this._setState({
          offers: this._state.offers.filter((offer) => offer.id !== selectedOffer.id)
        });
        checkbox.checked = false;
      }
    }
  };

  #pointDestinationHandler = (event) => {
    const destination = this.#destinations.find((item) => item.name === event.target.value);
    if (destination) {
      this.updateElement({
        destination: destination
      });
    }
  };

  #pointPriceHandler = (event) => {
    const value = parseInt(event.target.value, 10);
    const price = isNaN(value) ? 0 : value;
    event.target.value = price;
    this._setState({
      basePrice: price
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('click', this.#pointTypeHandler);
    if (this._state.offersByType.length > 0) {
      this.element.querySelector('.event__available-offers')
        .addEventListener('click', this.#pointOfferHandler);
    }
    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#pointDestinationHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#pointPriceHandler);

    this.#setDatepickerFrom();
    this.#setDatepickerTo();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.formClose);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  removeElement = () => {
    super.removeElement();
    if (this.#datepickerFrom || this.#datepickerTo) {
      this.#datepickerFrom.destroy();
      this.#datepickerTo.destroy();
      this.#datepickerFrom = null;
      this.#datepickerTo = null;
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate
    });
  };

  #setDatepickerFrom = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        default: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler
      }
    );
  };

  #setDatepickerTo = () => {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        default: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler
      }
    );
  };

  #deletePointHandler = () => {
    if (this.#mode === Mode.EDITTING) {
      this._callback.deleteClick(TripPointEditView.parseStateToPoint(this._state));
      return;
    }
    this._callback.deleteClick();
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };
}
