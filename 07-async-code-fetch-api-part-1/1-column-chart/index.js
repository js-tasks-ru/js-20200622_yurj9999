export default class ColumnChart {
  element = document.createElement('div');

  chartHeight = 50;
  subElements = {};
  data = [];

  constructor({
    url = '',
    range = {
      from: new Date(),
      to: new Date()
    },
    label = '',
    formatHeading = data => `$${data}`,
    link = ''
  } = {}) {

    this.element.setAttribute('style', `--chart-height: ${this.chartHeight}`);

    this.url = url;
    this.range = range;
    this.label = label;
    this.formatHeading = formatHeading;
    this.link = link;

    this.render();
    this.update();
  }

  getSubElements(mainElement) {
    const elements = mainElement.querySelectorAll('[data-element]');
    this.subElements = [...elements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;
      return acc;
    }, {});
  }

  setColumns(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map((item) => {
      const value = Math.floor(item * scale);
      const percents = (item / maxValue * 100).toFixed(0) + '%';
      return `<div style="--value:${value}" data-tooltip="${percents}"></div>`;
    }).join('');
  }

  setHeaderValue(data) {
    const value = data.reduce((acc, item) => acc + item, 0);
    return this.label === 'sales' ? this.formatHeading(value) : value;
  }

  render() {
    if (!this.data.length) {
      this.element.classList.add('column-chart_loading');
    }
    const title = `Total ${this.label}<a href="${this.link}" class="column-chart__link">View all</a>`;

    this.element.innerHTML = `<div class="column-chart__title">${title}</div>
    <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.setHeaderValue(this.data)}</div>
        <div data-element="body" class="column-chart__chart">${this.setColumns(this.data)}</div>
    </div>`;
    this.getSubElements(this.element);
  }

  async getDataFromServer(fromDate, toDate) {
    const isoFrom = fromDate.toISOString();
    const isoTo = toDate.toISOString();

    try {
      const response = await fetch(`https://course-js.javascript.ru/${this.url}?from=${isoFrom}&to=${isoTo}`);
      return Object.values(await response.json());
    } catch (e) {
      return [];
    }
  }

  async update(fromDate = this.range.from, toDate = this.range.to) {
    this.element.classList.add('column-chart_loading');

    try {
      this.data = await this.getDataFromServer(fromDate, toDate);
      if (this.data.length) {
        this.element.classList.remove('column-chart_loading');
        this.subElements.header.innerHTML = this.setHeaderValue(this.data);
        this.subElements.body.innerHTML = this.setColumns(this.data);
      }
    } catch (e) {
      return [];
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
