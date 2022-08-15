import ListFilterView from './view/list-filter-view';
import {render} from './render';
import ListPresenter from './presenter/list-presenter';

const listPrsenter = new ListPresenter();
const tripEvents = document.querySelector('.trip-events');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
render(new ListFilterView(), tripControlsFilters);

listPrsenter.init(tripEvents);
