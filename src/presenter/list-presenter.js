import ListSortView from '../view/list-sort-view.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import TripEventAddView from '../view/trip-event-add-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import TripEventView from '../view/trip-event-view.js';
import {render} from '../render.js';

export default class ListPresenter {
  listSortComponent = new ListSortView();
  tripEventEditComponent = new TripEventEditView();
  tripEventAddComponent = new TripEventAddView();
  tripEventsListComponent = new TripEventsListView();

  init = (listContainer) => {
    this.listContainer = listContainer;

    render(this.listSortComponent, this.listContainer);
    render(this.tripEventsListComponent, this.listContainer);
    render(this.tripEventEditComponent, this.tripEventsListComponent.getElement());
    render(this.tripEventAddComponent, this.tripEventsListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new TripEventView(), this.tripEventsListComponent.getElement());
    }
  };
}
