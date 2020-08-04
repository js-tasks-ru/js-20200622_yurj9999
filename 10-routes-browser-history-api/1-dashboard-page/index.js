import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  element = null;
  subElements = {};

  defaultDates = {
    from: new Date(2020, 6, 1),
    to: new Date()
  };




  rangeEvent = (event) => {
    console.log(event.detail);



  }



  constructor() {
    this.addListeners();
  }

  addListeners() {
    document.addEventListener('date-select', this.rangeEvent);
  }

  getSubElements(element) {
    const subElements = {};
    for (const subElement of element.querySelectorAll('[data-element]')) {
      subElements[subElement.dataset.element] = subElement;
    }
    return subElements;
  }



  pasteComponents() {
    const {rangePicker, charts} = this.subElements;
    const {from, to} = this.defaultDates;

    const range = new RangePicker({
      from, to
    });
    const orders = new ColumnChart({
      label: 'orders',
      link: '#',
      url: 'api/dashboard/orders',
      range: {
        from, to
      }
    });
    const sales = new ColumnChart({
      label: 'sales',
      url: 'api/dashboard/sales',
      range: {
        from, to
      }
    });
    const customers = new ColumnChart({
      label: 'customers',
      url: 'api/dashboard/customers',
      range: {
        from, to
      }
    });
    const sortableTable = new SortableTable({
      header
    });

    orders.element.classList.add('dashboard__chart_orders');
    sales.element.classList.add('dashboard__chart_sales');
    customers.element.classList.add('dashboard__chart_customers');

    rangePicker.append(range.element);
    charts.append(orders.element);
    charts.append(sales.element);
    charts.append(customers.element);

  }

  render() {
    this.element = document.createElement('div');
    this.element.setAttribute('data-element', 'mainContainer');
    this.element.setAttribute('class', 'dashboard full-height flex-column');

    this.element.innerHTML = `<div data-element="rangePicker" class="content__top-panel">
        <h2 class="page-title">Панель управления</h2>
    </div>
    <div data-element="charts" class="dashboard__charts"></div>
    <h3 class="block-title">Лидеры продаж</h3>`;

    this.subElements = this.getSubElements(this.element);
    this.pasteComponents();

    return this.element;
  }

  remove() {
    document.removeEventListener('date-select', this.rangeEvent);
  }

  destroy() {
    this.remove();
  }
}
