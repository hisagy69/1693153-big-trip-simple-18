import AbstractView from '../framework/view/abstract-view';
import {SortType} from '../const';
import {capitalizeFirstLetter} from '../utils/common';

const createListSortTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.values(SortType).map((value) => (`
        <div class="trip-sort__item  trip-sort__item--${value}">
          <input id="sort-${value}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${value}">
          <label class="trip-sort__btn" for="sort-${value}">${capitalizeFirstLetter(value)}</label>
        </div>
      `))}
  </form>`
);

export default class ListSortView extends AbstractView{
  get template() {
    return createListSortTemplate();
  }
}
