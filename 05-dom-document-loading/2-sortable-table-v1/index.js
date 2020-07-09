export default class SortableTable {
  element = null;
  subElements = null;

  constructor(header = [], {
    data = []
  } = {}) {

    this.header = header;
    this.data = data;

    this.render();
  }

  _setItemsProduct(items, product) {
    return `
      ${items.map((item) => {
        const id = item.id;
          return `
            <div class="sortable-table__cell">${id === 'images' ? `<img class="sortable-table-image" alt="Image" src="${product[id][0]?.url}">` : `${product[id]}`}</div>
          `;
        }).join('')
      }
    `;
  }

  _setProducts(data) {
    return `
      ${data.map((product) => {
        return `
            <a href="/products/${product.id}" class="sortable-table__row">
                ${this._setItemsProduct(this.header, product)}
            </a>
        `;
      }).join('')}
    `;
  }

  _sortIt(first, second, fieldName) {
    const dataType = this.header.find(item => item.id === fieldName).sortType;
    if (dataType === 'string') {
      return first[fieldName].localeCompare(second[fieldName], ['ru'], {usage: 'sort', caseFirst : 'upper'});
    } else if (dataType === 'number') {
      return first[fieldName] - second[fieldName];
    }
  };

  _getSubElements(mainElement) {
    const elements = mainElement.querySelectorAll('[data-element]');
    this.subElements = [...elements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;
      return acc;
    }, {});
  }

  _searchElement(elementName) {
    return this.subElements[elementName];
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.header.map((row = {}) => {
                  return `
                    <div class="sortable-table__cell" data-name="${row.id}">
                        <span>${row.title}</span>
                    </div>
                  `;
                }).join('')}
            </div>
            <div data-element="body" class="sortable-table__body">
                ${this._setProducts(this.data)}
            </div>
            <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
            <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                <div>
                    <p>No products satisfies your filter criteria</p>
                    <button type="button" class="button-primary-outline">Reset all filters</button>
                </div>
            </div>
        </div>
      </div>
    `;

    this.element = element.firstElementChild;

    this._getSubElements(this.element);
  }

  sort(field = '', sorting = '') {

    const sortData = [...this.data];

    if (sorting === 'asc') {
      sortData.sort((first, second) => this._sortIt(first, second, field));
    } else if (sorting === 'desc') {
      sortData.sort((first, second) => this._sortIt(second, first, field));
    }

    this._searchElement('body').innerHTML = this._setProducts(sortData);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

