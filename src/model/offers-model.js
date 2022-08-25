import {generateOffersType} from '../mock/offer';

export default class OffersModel {
  #offers = Array.from({length: 5}, (_value, index) => generateOffersType(index));

  get offers() {
    return this.#offers;
  }
}
