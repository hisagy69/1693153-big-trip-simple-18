import {generateOffersType} from '../mock/offer';

export default class OffersModel {
  offers = Array.from({length: 3}, (_value, index) => generateOffersType(index));

  getOffers = () => this.offers;
}
