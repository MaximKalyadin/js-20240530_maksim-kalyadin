export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this.createElement(this.createTemplate());
    this.subElements = {};
    this.getSubElements();
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    for (const element of elements) {
      this.subElements[element.dataset.element] = element;
    }
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;

    return element.firstElementChild;
  }

  createTemplate() {
    return (`
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          ${this.createTableTemplate()}
        </div>
      </div>`
    );
  }

  createTableTemplate() {
    return (`
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.createTableHeader()}
      </div>
      <div data-element="body" class="sortable-table__body">
        ${this.createTableBody()}
      </div>
      `
    );
  }

  createTableBody() {
    if (this.data.length === 0) {
      return this.createTableEmptySection();
    }

    return this.data.map(item => this.createTableItem(item)).join('');
  }

  createTableItem(item) {
    return (`
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.headerConfig.map((config) => {
        if (config.template) {
          return config.template(item.images);
        } else {
          return `<div class="sortable-table__cell">${item[config.id]}</div>`;
        }
      }
      ).join('')}
      </a>`
    );
  }

  createTableHeader() {
    return this.headerConfig?.map((value) => (`
      <div class="sortable-table__cell" data-id="${value.id}" data-sortable="${value.sortable}">
        <span>${value.title}</span>
      </div>`
    )).join('');
  }

  createTableEmptySection() {
    return (`
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>`
    );
  }

  sort(field, order = 'asc') {
    const column = this.headerConfig.find((value) => value.id === field);

    if (column && column.sortable) {
      this.data.sort((first, last) => {
        if (column.sortType === 'number') {
          return order === 'asc' ? first[field] - last[field] : last[field] - first[field];
        } else {
          return order === 'asc' ? first[field].localeCompare(last[field], ['ru', 'en'], {caseFirst: 'upper'}) : last[field].localeCompare(first[field], ['ru', 'en'], {caseFirst: 'upper'});
        }
      });
    }

    this.subElements.body.innerHTML = this.data.map(item => this.createTableItem(item)).join('');
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }
}
