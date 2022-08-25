import {generateOffersType} from '../mock/offer';

export default class OffersModel {
  #offers = Array.from({length: 10}, (_value, index) => generateOffersType(index));

  get offers() {
    return this.#offers;
  }
}
