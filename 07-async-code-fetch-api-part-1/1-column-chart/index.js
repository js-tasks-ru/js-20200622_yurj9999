export default class ColumnChart {
  element = null;

  chartHeight = 50; // ???

  constructor({
    url = '',
    range = {
      from: new Date,
      to: new Date
    },
    label = '',
    formatHeading = data => `$${data}`,
    link = ''
  } = {}) {

    this.url = url;
    this.range = range;
    this.label = label;
    this.formatHeading = formatHeading;
    this.link = link;

    //this.render();

  }

  /*constructor() {

    url: 'api/dashboard/orders',
      range: {
      from: new Date('2020-04-06'),
        to: new Date('2020-05-06'),
    },
    label: 'orders',
      link: '#'


    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.render();
  }*/

  setColumns(data) {
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

    /*if (this.data.length === 0) {
      element.classList.add('column-chart_loading');
      element.setAttribute('style', `--chart-height: ${this.chartHeight}`);
    }

    element.innerHTML = `<div class="column-chart__title">
        Total ${this.label}<a href="${this.link}" class="column-chart__link">View all</a>
    </div>
    <div class="column-chart__container">
        <div class="column-chart__header">${this.value}</div>
        <div class="column-chart__chart">${this.setColumns(this.data)}</div>
    </div>`;

    this.element = element;*/
  }

  /*update({bodyData = []} = {}) {
    const updatingElement = this.element.querySelector('.column-chart__chart');
    updatingElement.innerHTML = this.setColumns(bodyData);
  }*/


  // возвращает {[данные]} их в метод обновлени DOM

  async update(fromDate = this.range.from, toDate = this.range.to) {

    // здесь вызывать метод запроса на сервер, как он отработает, 

    const isoFrom = fromDate.toISOString();
    const isoTo = toDate.toISOString();

    const response = await fetch(`https://course-js.javascript.ru/${this.url}?from=${isoFrom}&to=${isoTo}`);


    console.log(await response.json());


  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
