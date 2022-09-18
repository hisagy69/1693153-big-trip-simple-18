import AbstractView from '../framework/view/abstract-view';

const createListFilterTemplate = (filters, currentFilter) => (
  `<form class="trip-filters" action="#" method="get">
    ${(filters).map(({type, name}) =>
    (`<div class="trip-filters__filter">
        <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${currentFilter === type ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
      </div>`)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class ListFilterView extends AbstractView {
  #filters = [];
  #currentFilter = null;

  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createListFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (event) => {
    console.log('change')
    event.preventDefault();
    this._callback.filterTypeChange(event.target.value);
  };
}
