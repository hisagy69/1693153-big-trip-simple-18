import ListFilterView from './view/list-filter-view';
import {render} from './render';
import ListPresenter from './presenter/list-presenter';
import EventAddButtonView from './view/event-add-button-view';

const listPrsenter = new ListPresenter();
const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
render(new ListFilterView(), tripControlsFilters);
render(new EventAddButtonView(), tripMain);

listPrsenter.init(tripEvents);
