import {generateEvent} from '../mock/event';

export default class EventModel {
  events = Array.from({length: 3}, generateEvent);

  getEvents = () => this.events;
}
