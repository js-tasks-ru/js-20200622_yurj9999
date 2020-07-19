import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element = document.createElement('div');
  subElements = {};
  hasLocalData = false;
  serverIsEmpty = false;
  isDataLoading = false;
  step = 0;

  sorting = async (event) => {
    const target = event.target.closest('div');
    const isSortable = target.dataset.sortable;

    if (target && isSortable) {
      const id = target.dataset.id;
      const order = target.dataset.order === '' || target.dataset.order === 'asc' ? 'desc' : 'asc';

      this.sortingOptions.id = id;
      this.sortingOptions.order = order;

      this.subElements.header.innerHTML = this.head(this.header);

      if (this.hasLocalData) {
        this.sortOnClient(id, order)
      } else {
        this.step = 0;
        this.data = [];
        this.serverIsEmpty = false;

        try {
          await this.sortOnServer(id, order);
        } catch (e) {
          return [];
        }
        //await this.sortOnServer(id, order);
      }
    }
  }

  scrollingDataLoading = async () => {
    const clientHeight = document.documentElement.clientHeight;
    const bottom = Math.floor(document.documentElement.getBoundingClientRect().bottom);
    if (!this.isDataLoading && bottom <= clientHeight + 100) {

      try {
        await this.sortOnServer();
      } catch (e) {
        return [];
      }
      //await this.sortOnServer();
    }
  }

  constructor(header = [], {
    data = [],
    url = '',
    sorted = {
      id: header.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {
    this.header = header;
    this.url = url;
    this.data = data;
    this.sortingOptions = sorted;

    this.render();

    if (this.data.length) {
      this.hasLocalData = true;
      this.sortOnClient('title', 'asc');
    } else {
      this.sortOnServer();
    }

    this.addListeners();
  }

  async sortOnServer(id = this.sortingOptions.id, order = this.sortingOptions.order) {
    const elementCount = 30;
    const range = `_start=${this.step}&_end=${this.step + elementCount}`;
    const queryStr = `${BACKEND_URL}/${this.url}?_embed=subcategory.category&_sort=${id}&_order=${order}&${range}`;

    if (!this.serverIsEmpty) {
      this.subElements.main.classList.add('sortable-table_loading');
      this.isDataLoading = true;

      try {
        const result = await fetch(queryStr);
        const newData = await result.json();

        if (newData.length < elementCount) {
          this.serverIsEmpty = true;
        }

        this.isDataLoading = false;
        this.subElements.main.classList.remove('sortable-table_loading');

        if (!newData.length) {
          this.subElements.main.classList.add('sortable-table_empty');
        }

        this.data = [...this.data, ...newData];
        this.subElements.body.innerHTML = this.body(this.data);
        this.step = this.step + elementCount;
      } catch (e) {
        return [];
      }
    }
  }

  addListeners() {
    this.subElements.header.addEventListener('pointerdown', this.sorting);
    if (!this.hasLocalData) {
      document.addEventListener('scroll', this.scrollingDataLoading);
    }
  }

  getSubElements(mainElement) {
    const elements = mainElement.querySelectorAll('[data-element]');
    this.subElements = [...elements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;
      return acc;
    }, {});
  }

  head(header) {
    return header.map((row = {}) => {
      const dataOrder = this.sortingOptions.id === row.id ? this.sortingOptions.order : '';
      const dataSortable = row.sortable ? row.sortable : '';

      return `<div class="sortable-table__cell" data-id="${row.id}" data-order="${dataOrder}" data-sortable="${dataSortable}">
        <span>${row.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
        </span>
      </div>`;
    }).join('');
  }

  bodyItems(items, product) {
    return items.map(item =>
      !!item.template ? item.template(product[item.id]) : `<div class="sortable-table__cell">${product[item.id]}</div>`
    ).join('');
  }

  body(data) {
    return data.map((product) => {
      return `<a href="/products/${product.id}" class="sortable-table__row">${this.bodyItems(this.header, product)}</a>`;
    }).join('');
  }

  render() {
    this.element.innerHTML = `<div data-element="productsContainer" class="products-list__container">
        <div data-element="main" class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">${this.head(this.header)}</div>
            <div data-element="body" class="sortable-table__body">${this.body(this.data)}</div>
            <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
            <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                <div>
                    <p>No products satisfies your filter criteria</p>
                    <button type="button" class="button-primary-outline">Reset all filters</button>
                </div>
            </div>
        </div>
    </div>`;

    this.getSubElements(this.element);
  }

  sortOnClient(id = '', order = '') {
    const sortData = [...this.data];

    const sortIt = (first, second, id) => {
      const dataType = this.header.find(item => item.id === id).sortType;
      if (dataType === 'string') {
        return first[id].localeCompare(second[id], ['ru'], {usage: 'sort', caseFirst : 'upper'});
      } else if (dataType === 'number') {
        return first[id] - second[id];
      }
    }

    if (order === 'asc') {
      sortData.sort((first, second) => sortIt(first, second, id));
    } else if (order === 'desc') {
      sortData.sort((first, second) => sortIt(second, first, id));
    }

    this.sortingOptions.id = id;
    this.sortingOptions.order = order;

    this.subElements.body.innerHTML = this.body(sortData);
  }

  remove() {
    this.element.remove();
    this.subElements.header.removeEventListener('pointerdown', this.sorting);
    if (!this.hasLocalData) {
      document.removeEventListener('scroll', this.scrollingDataLoading);
    }
  }

  destroy() {
    this.remove();
  }
}
