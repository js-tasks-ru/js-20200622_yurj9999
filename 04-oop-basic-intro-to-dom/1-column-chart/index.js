export default class ColumnChart {
  element = null;
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = ''
  } = {}) {

    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

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

    if (this.data.length === 0) {
      element.classList.add('column-chart_loading');
      element.setAttribute('style', `--chart-height: ${this.chartHeight}`);
    }

    element.innerHTML = `
        <div class="column-chart__title">
            Total ${this.label}
            <a href="${this.link}" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
            <div class="column-chart__header">${this.value}</div>
            <div class="column-chart__chart">
                ${this._setColumns(this.data)}
            </div>
        </div>
    `;

    this.element = element;
  }

  update({
    bodyData = []
  } = {}) {
    const updatingElement = this.element.querySelector('.column-chart__chart');
    updatingElement.innerHTML = this._setColumns(bodyData);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
