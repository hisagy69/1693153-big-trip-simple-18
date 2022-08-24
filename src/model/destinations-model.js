import {generateDestination} from '../mock/destination';

export default class DestinationsModel {
  #destinations = Array.from({length: 3}, (_value, index) => generateDestination(index));

  get destinations(){
    return this.#destinations;
  }
}
