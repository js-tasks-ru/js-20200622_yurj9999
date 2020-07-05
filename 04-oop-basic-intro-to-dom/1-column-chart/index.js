export default class ColumnChart {
  constructor(options) {
    this.options = options;
    this.element = null;
    this.chartHeight = 50;

    if (this.options) {
      this.data = options.data;
      this.label = options.label;
      this.value = options.value;
      this.link = options.link;
    }

    this.render();
  }

  _setColumns(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map((item) => {
      const value = Math.floor(item * scale);
      const percents = (item / maxValue * 100).toFixed(0) + '%';
      return `<div style="--value:${value}" data-tooltip="${percents}"></div>`;
    }).join('');
  }

  render() {
    const element = document.createElement('div');

    if (!this.options || (this.data && this.data.length === 0)) {
      element.classList.add('column-chart_loading');
      element.setAttribute('style', `--chart-height: ${this.chartHeight}`);
    }

    element.innerHTML = `
        <div class="column-chart__title">
            Total ${this.label ? this.label : ''}
            ${this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : ''}
        </div>
        <div class="column-chart__container">
            <div class="column-chart__header">${this.value ? this.value : ''}</div>
            <div class="column-chart__chart">
                ${this.data ? this._setColumns(this.data) : ''}
            </div>
        </div>
    `;

    this.element = element;
  }

  update(newData) {
    const updatingElement = this.element.querySelector('.column-chart__chart');
    if (newData && newData.bodyData) {
      this.data = newData.bodyData;
      updatingElement.innerHTML = this._setColumns(this.data);
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
