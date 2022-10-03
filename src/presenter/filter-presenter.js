import ListFilterView from '../view/list-filter-view';
import {remove, render, replace} from '../framework/render';
import {UpdateType} from '../const';
import {filter} from '../utils/points';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }


  get filters() {
    return [
      {
        type: 'everithing',
        name: 'EVERITHING',
        isActive: true
      },
      {
        type: 'future',
        name: 'FUTURE',
        isActive: filter['future'](this.#pointsModel.points).length > 0
      }
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new ListFilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) =>{
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
