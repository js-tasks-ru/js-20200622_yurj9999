import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';
const IMGUR_URL = 'https://api.imgur.com';

export default class ProductForm {

  element = null;
  subElements = {};

  selectedSubcategory = '';
  title = '';
  description = '';
  images = [];
  selectedCategory = '';
  categories = [];
  price = 0;
  discount = 0;
  quantity = 0;
  status = 1;
  nameSaveButton = 'Добавить товар';

  sendDataToServer = async (event) => {
    event.preventDefault();

    const {
      title,
      productDescription,
      imageListContainer,
      price,
      discount,
      quantity,
      status,
    } = this.subElements;

    const preparedData = {
      description: productDescription.value,
      discount: Number(discount.value),
      images: [],
      price: Number(price.value),
      quantity: Number(quantity.value),
      status: Number(status.value),
      subcategory: this.selectedSubcategory,
      title: title.value
    };

    imageListContainer.firstElementChild.childNodes.forEach((item) => {
      preparedData.images.push({
        source: item.children[1].value,
        url: item.children[0].value
      });
    });

    if (!!this.id) {
      preparedData.id = this.id;
      this.save(preparedData);
    } else {
      this.update(preparedData);
    }
  }

  selectedElement = (event) => {
    this.selectedSubcategory = event.target.value;
  }

  // метод обработки ошибок
  errorHandler = () => {
    return [];
  }

  callInputFileElement = () => {
    this.subElements.file.click();
  }

  uploadFile = async (event) => {
    const img = event.target.files[0];
    const formData = new FormData();

    formData.append('image', img, img.name);

    const imgUploadResponse = await fetchJson(this.getImgurUrl(), {
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
      },
      method: 'POST',
      body: formData
    });

    this.subElements.imageListContainer.firstElementChild.append(this.setPhotoElement(img.name, imgUploadResponse.data.link));
  }

  constructor(id = '') {
    this.id = id;
  }

  async save(data) {
    await fetchJson(this.getUpdatedProductUrl(), {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify(data)
    });

    this.element.dispatchEvent(new CustomEvent('product-updated', {
      detail: 'Товар обновлен',
      bubbles: true
    }));
  }

  async update(data) {
    await fetchJson(this.getUpdatedProductUrl(), {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(data)
    });

    this.element.dispatchEvent(new CustomEvent('product-saved', {
      detail: 'Товар сохранен',
      bubbles: true
    }));

    this.updateDom();
  }

  setPhotoElement(name, url) {
    const photoElement = document.createElement('li');
    photoElement.classList.add('products-edit__imagelist-item');
    photoElement.classList.add('sortable-list__item');

    photoElement.innerHTML = `<input type="hidden" name="url" value="${url}">
        <input type="hidden" name="source" value="${name}">
        <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${url}">
            <span>${name}</span>
        </span>
    <button type="button"><img src="icon-trash.svg" data-delete-handle="" alt="delete"></button>`;

    return photoElement;
  }

  getSubElements(mainElement) {
    const elements = mainElement.querySelectorAll('[data-element]');
    this.subElements = [...elements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;
      return acc;
    }, {});
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = `<div class="product-form">
        <form data-element="productForm" class="form-grid">

            <div class="form-group form-group__half_left">
                <fieldset>
                    <label class="form-label">Название товара</label>
                    <input id="title" required="" data-element="title" type="text" name="title" class="form-control" placeholder="Название товара">
                </fieldset>
            </div>

            <div class="form-group form-group__wide">
                <label class="form-label">Описание</label>
                <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
            </div>

            <div class="form-group form-group__wide" data-element="sortableListContainer">
                <label class="form-label">Фото</label>
                <div data-element="imageListContainer">
                    <ul class="sortable-list"></ul>
                </div>
                <button data-element="uploader" type="button" name="uploadImage" class="button-primary-outline fit-content">
                    <span>Загрузить</span>
                </button>
            </div>

            <div class="form-group form-group__half_left">
                <label class="form-label">Категория</label>
                <select id="subcategory" data-element="categories" class="form-control" name="subcategory"></select>
            </div>

            <div class="form-group form-group__half_left form-group__two-col">
                <fieldset>
                    <label class="form-label">Цена ($)</label>
                    <input id="price" data-element="price" required="" type="number" name="price" class="form-control" placeholder="100">
                </fieldset>
                <fieldset>
                    <label class="form-label">Скидка ($)</label>
                    <input id="discount" data-element="discount" required="" type="number" name="discount" class="form-control" placeholder="0">
                </fieldset>
            </div>

            <div class="form-group form-group__part-half">
                <label class="form-label">Количество</label>
                <input id="quantity" data-element="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1">
            </div>

            <div class="form-group form-group__part-half">
                <label class="form-label">Статус</label>
                <select id="status" data-element="status" class="form-control" name="status">
                    <option value="1">Активен</option>
                    <option value="0">Неактивен</option>
                </select>
            </div>

            <div class="form-buttons">
                <button data-element="saveButton" type="submit" name="save" class="button-primary-outline">Сохранить товар</button>
            </div>

        </form>
        <input data-element="file" type="file" name="picture" accept="image/*" hidden>
    </div>`;

    this.element = element.firstElementChild;

    this.getSubElements(this.element);
    this.addListeners();
    this.updateDom();
  }

  addListeners() {
    const {uploader, file, productForm, categories} = this.subElements;

    window.addEventListener('unhandledrejection', this.errorHandler);
    uploader.addEventListener('click', this.callInputFileElement);
    file.addEventListener('change', this.uploadFile);
    productForm.addEventListener('submit', this.sendDataToServer);
    categories.addEventListener('change', this.selectedElement);
  }

  getImgurUrl() {
    return new URL('3/image', IMGUR_URL);
  }

  getCategoriesUrl() {
    const url = new URL('api/rest/categories', BACKEND_URL);
    url.searchParams.set('_sort', 'weight');
    url.searchParams.set('_refs', 'subcategory');
    return url;
  }

  getProductUrl() {
    const url = new URL('api/rest/products', BACKEND_URL);
    url.searchParams.set('id', this.id);
    return url;
  }

  getUpdatedProductUrl() {
    return new URL('api/rest/products', BACKEND_URL);
  }

  async getFetchData() {
    const productResponse = fetchJson(this.getProductUrl());
    const categoriesResponse = fetchJson(this.getCategoriesUrl());

    return await Promise.resolve({
      productResponse, categoriesResponse
    });
  }

  async preparedData() {
    const result = await this.getFetchData();

    const productData = await result.productResponse;
    const categoriesData = await result.categoriesResponse;

    if (productData.length) {
      this.title = productData[0].title;
      this.description = productData[0].description;
      this.images = productData[0].images;
      this.selectedCategory = productData[0].subcategory;
      this.price = productData[0].price;
      this.discount = productData[0].discount;
      this.quantity = productData[0].quantity;
      this.status = productData[0].status;
      this.nameSaveButton = 'Сохранить товар';
    }

    categoriesData.forEach((item) => {
      item.subcategories.forEach((subElement) => {
        if (this.id && subElement.id.includes(this.selectedCategory)) {
          this.selectedSubcategory = subElement.id;
        }
        const selected = this.id && subElement.id.includes(this.selectedCategory) ? 'selected' : '';
        this.categories.push(`<option ${selected} value="${subElement.id}">${item.title} > ${subElement.title}</option>`);
      });
    });
  }

  async updateDom() {
    await this.preparedData();

    const {
      title,
      productDescription,
      imageListContainer,
      categories,
      price,
      discount,
      quantity,
      status,
      saveButton
    } = this.subElements;

    title.value = this.title;
    productDescription.value = this.description;

    this.images.map((image) => imageListContainer.firstElementChild.append(this.setPhotoElement(image.source, image.url)));

    categories.innerHTML = this.categories.map(item => item).join('');
    price.value = !!this.price ? this.price : '';
    discount.value = this.id ? this.discount : '';
    quantity.value = !!this.quantity ? this.quantity : '';
    status.value = this.status;
    saveButton.textContent = this.nameSaveButton;
  }

  remove() {
    const {uploader, file, productForm, categories} = this.subElements;

    window.removeEventListener('unhandledrejection', this.errorHandler);
    uploader.removeEventListener('click', this.callInputFileElement);
    file.removeEventListener('change', this.uploadFile);
    productForm.removeEventListener('submit', this.sendDataToServer);
    categories.removeEventListener('change', this.selectedElement);
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
