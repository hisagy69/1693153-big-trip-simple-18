import {render} from './framework/render';
import ListPresenter from './presenter/list-presenter';
import PointAddButtonView from './view/point-add-button-view';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import PointsApiService from './point-api-service';

const AUTHORIZATION = 'Basic kqRSTujsauA';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip/';

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const pointAddButtonComponent = new PointAddButtonView();

const tripMain = document.querySelector('.trip-main');
const tripEvents = document.querySelector('.trip-events');
const tripControlsFilters = document.querySelector('.trip-controls__filters');

const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, pointsModel);
const listPresenter = new ListPresenter(tripEvents, pointsModel, filterModel);

const handleNewPointButtonClose = () => {
  pointAddButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  listPresenter.createPoint(handleNewPointButtonClose);
  pointAddButtonComponent.element.disabled = true;
};

filterPresenter.init();
listPresenter.init();
pointsModel.init()
  .finally(() => {
    render(pointAddButtonComponent, tripMain);
    pointAddButtonComponent.setClickHandler(handleNewPointButtonClick);
  });
