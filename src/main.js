import ListFilterView from './view/list-filter-view';
import {render} from './render';
import ListPresenter from './presenter/list-presenter';
import PointAddButtonView from './view/point-add-button-view';
import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const listPresenter = new ListPresenter();
const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');
const tripControlsFilters = document.querySelector('.trip-controls__filters');
render(new ListFilterView(), tripControlsFilters);
render(new PointAddButtonView(), tripMain);

listPresenter.init(tripEvents, pointsModel, offersModel, destinationsModel);
