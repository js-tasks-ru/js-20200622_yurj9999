import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {

  element = null;
  subElements = {};
  rangePicker = null;
  chart = null;

  constructor() {
    this.rangePicker = new RangePicker({
      from: new Date(2020, 6, 4),
      to: new Date()
    });
  }

  getSubElements(element) {
    const subElements = {};
    for (const subElement of element.querySelectorAll('[data-element]')) {
      subElements[subElement.dataset.element] = subElement;
    }
    return subElements;
  }

  render() {

    this.element = document.createElement('div');
    this.element.setAttribute('class', 'dashboard full-height flex-column');

    this.element.innerHTML = `<div data-element="rangePicker" class="content__top-panel">
        <h2 class="page-title">Панель управления</h2>
    </div>
    <div data-element="charts" class="dashboard__charts"></div>
    <h3 class="block-title">Лидеры продаж</h3>`;

    this.subElements = this.getSubElements(this.element);

    const {rangePicker, charts} = this.subElements;

    rangePicker.append(this.rangePicker.element);

    return this.element;

  }

  remove() {

  }

  destroy() {
    this.remove();
  }

}
