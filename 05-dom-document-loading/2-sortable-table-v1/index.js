export default class SortableTable {
  element = null;
  allDataElements = [];

  constructor(header = [], {
    data = []
  } = {}) {

    this.header = header;
    this.data = data;

    this.render();
  }

  _setProducts(data) {
    return `
      ${data.map((product) => {
        return `
          <a href="/products/${product.id}" class="sortable-table__row">
              <div class="sortable-table__cell">
                  ${product.images[0].url ?
                    `<img class="sortable-table-image" alt="Image" src="${product.images[0]?.url}">`
                    : ''
                  }
              </div>
              <div class="sortable-table__cell">${product.title}</div>
              <div class="sortable-table__cell">
                  <span data-tooltip="
                      <div class=&quot;sortable-table-tooltip&quot;>
                          <span class=&quot;sortable-table-tooltip__category&quot;>
                              ${product.subcategory.title}
                          </span>
                          / <b class=&quot;sortable-table-tooltip__subcategory&quot;>
                              ${product.subcategory.category.title}
                          </b>
                      </div>
                  ">${product.quantity}</span>
              </div>
              <div class="sortable-table__cell">$${product.price}</div>
              <div class="sortable-table__cell">${product.sales}</div>
              <div class="sortable-table__cell">Enabled</div>
          </a>
        `;
      }).join('')}
    `;
  }

  _sortIt(first, second, fieldName) {
    return String(first[fieldName]).localeCompare(
      String(second[fieldName]), [], {sensitivity: 'variant', caseFirst: 'upper', numeric: true});
  };

  _getSubElementsArray(mainElement) {
    this.allDataElements = [...mainElement.querySelectorAll('[data-element]')];
  }

  _searchElement(elementName) {
    return this.allDataElements.filter((element) => {
      return element.dataset.element === elementName;
    })[0];
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

    this._getSubElementsArray(this.element);
  }

  sort(field = '', sorting = '') {

    const sortData = [...this.data];

    if (sorting === 'asc') {
      sortData.sort((first, second) => {
        return this._sortIt(first, second, field);
      });
    } else if (sorting === 'desc') {
      sortData.sort((first, second) => {
        return this._sortIt(second, first, field);
      });
    }

    const bodyElement = this.allDataElements.filter((element) => {
      return element.dataset.element === 'body';
    });

    this._searchElement('body').innerHTML = this._setProducts(sortData);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

