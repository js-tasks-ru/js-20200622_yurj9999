export default class SortableTable {
  element = null;
  subElements = null;

  constructor(header = [], {
    data = [],
    sorted = {
      id: header.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {
    this.header = header;
    this.data = data;
    this.sortingOptions = sorted;

    this.render();
    this.addListeners();
  }

  addListeners() {
    this.subElements.header.addEventListener('pointerdown', this.sorting.bind(this));
  }

  sorting(event) {
    const target = event.target.closest('div');
    const isSortable = target.dataset.sortable;

    if (target && isSortable) {
      const order = target.dataset.order === '' || target.dataset.order === 'asc' ? 'desc' : 'asc';
      this.sort(target.dataset.id, order);
    }
  }

  getSubElements(mainElement) {
    const elements = mainElement.querySelectorAll('[data-element]');
    this.subElements = [...elements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;
      return acc;
    }, {});
  }

  bodyItems(items, product) {
    return items.map((item) => {
      const id = item.id;
      if (id === 'images') {
        return `<div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="${product[id][0]?.url}">
        </div>`;
      } else {
        return `<div class="sortable-table__cell">${product[id]}</div>`;
      }
    }).join('');
  }

  head(header) {
    return header.map((row = {}) => {
      return `<div class="sortable-table__cell" data-id="${row.id}"
        data-order="${this.sortingOptions.id === row.id ? `${this.sortingOptions.order}` : ''}"
        ${row.sortable ? `data-sortable=${row.sortable}` : ''}>
        <span>${row.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
        </span>
      </div>`;
    }).join('');
  }

  body(data) {
    return data.map((product) => {
      return `<a href="/products/${product.id}" class="sortable-table__row">
        ${this.bodyItems(this.header, product)}
      </a>`;
    }).join('');
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = `<div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.head(this.header)}
            </div>
            <div data-element="body" class="sortable-table__body">
                ${this.body(this.data)}
            </div>
            <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
            <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                <div>
                    <p>No products satisfies your filter criteria</p>
                    <button type="button" class="button-primary-outline">Reset all filters</button>
                </div>
            </div>
        </div>
    </div>`;

    this.element = element.firstElementChild;
    this.getSubElements(this.element);

    this.sort('title', 'asc');
  }

  sort(field = '', sorting = '') {

    const sortData = [...this.data];

    const sortIt = (first, second, fieldName) => {
      const dataType = this.header.find(item => item.id === fieldName).sortType;
      if (dataType === 'string') {
        return first[fieldName].localeCompare(second[fieldName], ['ru'], {usage: 'sort', caseFirst : 'upper'});
      } else if (dataType === 'number') {
        return first[fieldName] - second[fieldName];
      }
    }

    if (sorting === 'asc') {
      sortData.sort((first, second) => sortIt(first, second, field));
    } else if (sorting === 'desc') {
      sortData.sort((first, second) => sortIt(second, first, field));
    }

    this.sortingOptions.id = field;
    this.sortingOptions.order = sorting;

    this.refresh(this.header, sortData);
  }

  refresh(headerData, bodyData) {
    this.subElements.header.innerHTML = this.head(headerData);
    this.subElements.body.innerHTML = this.body(bodyData);
  }

  remove() {
    this.element.remove();
    this.subElements.header.removeEventListener('pointerdown', this.sorting);
  }

  destroy() {
    this.remove();
  }
}
