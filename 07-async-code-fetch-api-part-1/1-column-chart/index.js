import fetchJson from './utils/fetch-json.js';
import ColumnChart from "../../04-oop-basic-intro-to-dom/1-column-chart";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart2 extends ColumnChart {
  constructor(options) {
    super(options);

    this.url = options?.url || '';

    this.subElements = {};
    this.getSubElements();

    this.update(options?.range?.from || new Date(), options?.range?.to || new Date());
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    for (const element of elements) {
      this.subElements[element.dataset.element] = element;
    }
  }

  async update(from, to) {
    this.element.classList.add('column-chart_loading');

    const query = new URL(this.url, BACKEND_URL);
    query.searchParams.set('from', from);
    query.searchParams.set('to', to);

    const data = await fetchJson(query);

    super.update(Object.values(data));
    this.subElements.header.textContent = this.formatHeading(Object.keys(data).length);

    this.element.classList.remove('column-chart_loading');

    return data;
  }
}
