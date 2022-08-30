import AbstractView from '../framework/view/abstract-view';
import {FilterType} from '../const';
import {capitalizeFirstLetter} from '../utils/common';

const createListFilterTemplate = () => (
  `<form class="trip-filters" action="#" method="get">
    ${Object.values(FilterType).map((value) =>
    (`<div class="trip-filters__filter">
        <input id="filter-${value}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${value}">
        <label class="trip-filters__filter-label" for="filter-${value}">${capitalizeFirstLetter(value)}</label>
      </div>`)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class ListFilterView extends AbstractView {
  get template() {
    return createListFilterTemplate();
  }
}
