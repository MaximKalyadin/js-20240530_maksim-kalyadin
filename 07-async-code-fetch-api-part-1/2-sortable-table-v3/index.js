import fetchJson from './utils/fetch-json.js';
import SortableTable2 from "../../06-events-practice/1-sortable-table-v2";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable3 extends SortableTable2 {
  offset = 30;
  constructor(headersConfig, {
    data = [],
    sorted = {},
    url = '',
    isSortLocally = false,
  } = {}) {
    super(headersConfig, { data, sorted });
    this.isSortLocally = isSortLocally;
    this.url = new URL(url, BACKEND_URL);
    this.start = 0;
    this.end = this.offset;

    this.render();
    this.createScrollListener();
  }

  handleScroll = (e) => {
    e.stopPropagation();
    const { bottom } = document.documentElement.getBoundingClientRect();

    if (bottom < document.documentElement.clientHeight + 100) {
      this.start = this.end;
      this.end += this.offset;

      this.render();
    }
  }

  createScrollListener() {
    document.addEventListener('scroll', this.handleScroll);
  }

  removeScrollListener() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  sort(id, order) {
    if (this.isSortLocally) {
      this.sortOnClient(id, order);
    } else {
      this.sortOnServer(id, order);
    }
  }

  sortOnClient(id, order) {
    super.sort(id, order);
  }

  sortOnServer(id, order) {
    if (!this.url) {
      return;
    }

    this.url.searchParams.set('_sort', id);
    this.url.searchParams.set('_order', order);

    this.render();
  }

  async render() {
    this.url.searchParams.set('_start', this.start);
    this.url.searchParams.set('_end', this.end);

    this.data = await fetchJson(this.url);

    this.subElements.body.innerHTML = this.createTableBody();
    return this.data;
  }

  remove() {
    this.removeScrollListener();
    super.remove();
  }
}
