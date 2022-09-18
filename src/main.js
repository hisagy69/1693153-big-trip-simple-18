import {render} from './framework/render';
import ListPresenter from './presenter/list-presenter';
import PointAddButtonView from './view/point-add-button-view';
import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');
const tripControlsFilters = document.querySelector('.trip-controls__filters');

const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, pointsModel);
const listPresenter = new ListPresenter(tripEvents, pointsModel, offersModel, filterModel, destinationsModel);

render(new PointAddButtonView(), tripMain);

filterPresenter.init();
listPresenter.init();
