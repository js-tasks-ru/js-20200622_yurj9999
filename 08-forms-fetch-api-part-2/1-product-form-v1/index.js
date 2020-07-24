import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const IMGUR_URL = 'https://api.imgur.com';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element = null;
  subElements = {};
  selectedSubcategory = '';

  callFileloader = () => {
    this.subElements.productForm.elements.fileLoader.click();
  }

  uploadFile = async (event) => {
    const img = event.target.files[0];
    const formData = new FormData();
    const formImage = this.subElements.imageListContainer.firstElementChild;
    formData.append('image', img, img.name);

    try {
      const imgUploadResponse = await fetchJson(`${IMGUR_URL}/3/image`, {
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
        },
        method: 'POST',
        body: formData
      });
      formImage.append(this.setPhotoElement(img.name, imgUploadResponse.data.link));
    } catch (error) {
      return [];
    }
  }

  selectedElement = (event) => {
    this.selectedSubcategory = event.target.value;
  }

  sendDataToServer = async (event) => {
    event.preventDefault();

    const form = this.subElements.productForm.elements;
    const images = this.subElements.imageListContainer.firstElementChild.childNodes;
    const newFormData = {};

    newFormData.title = form.title.value;
    newFormData.description = form.description.value;
    newFormData.discount = Number(form.discount.value);
    newFormData.price = Number(form.price.value);
    newFormData.quantity = Number(form.quantity.value);
    newFormData.status = Number(form.status.value);
    newFormData.subcategory = this.selectedSubcategory;
    newFormData.images = [];

    this.id ? newFormData.id = this.id : null;

    images.forEach((image) => {
      newFormData.images.push({
        source: image.children[1].value,
        url: image.children[0].value
      });
    });

    try {
      await fetchJson(`${BACKEND_URL}/api/rest/products`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: this.id ? 'PATCH' : 'PUT',
        body: JSON.stringify(newFormData)
      });
    } catch (error) {
      return [];
    }

    this.id ? this.save() : this.update();
  }

  constructor(id = '') {
    this.id = id;
  }

  save() {
    this.element.dispatchEvent(new CustomEvent('product-updated', {
      detail: 'Товар сохранен',
      bubbles: true
    }));
  }

  update() {
    this.element.dispatchEvent(new CustomEvent('product-saved', {
      detail: 'Товар обновлен',
      bubbles: true
    }));
  }

  getSubElements(mainElement) {
    const elements = mainElement.querySelectorAll('[data-element]');
    this.subElements = [...elements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;
      return acc;
    }, {});
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

  async render() {
    const element = document.createElement('div');

    element.innerHTML = `<div class="product-form">
        <form data-element="productForm" name="productForm" class="form-grid">

            <div class="form-group form-group__half_left">
                <fieldset>
                    <label class="form-label">Название товара</label>
                    <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
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
                <button type="button" name="uploadImage" class="button-primary-outline fit-content">
                    <span>Загрузить</span>
                </button>
                <input name="fileLoader" type="file" accept="image/*" hidden>
            </div>

            <div class="form-group form-group__half_left">
                <label class="form-label">Категория</label>
                <select id="subcategory" class="form-control" name="subcategory"></select>
            </div>

            <div class="form-group form-group__half_left form-group__two-col">
                <fieldset>
                    <label class="form-label">Цена ($)</label>
                    <input id="price" required="" type="number" name="price" class="form-control" placeholder="100">
                </fieldset>
                <fieldset>
                    <label class="form-label">Скидка ($)</label>
                    <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0">
                </fieldset>
            </div>

            <div class="form-group form-group__part-half">
                <label class="form-label">Количество</label>
                <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1">
            </div>

            <div class="form-group form-group__part-half">
                <label class="form-label">Статус</label>
                <select id="status" class="form-control" name="status">
                    <option value="1">Активен</option>
                    <option value="0">Неактивен</option>
                </select>
            </div>

            <div class="form-buttons">
                <button type="submit" name="save" class="button-primary-outline">${this.id ? 'Сохранить товар' : 'Добавить товар'}</button>
            </div>

        </form>
    </div>`;

    this.element = element.firstElementChild;

    this.getSubElements(this.element);
    this.addListeners();

    try {
      const [product, categories] = await this.getFetchData();
      if (this.id) {
        this.productLoading(product);
      }
      this.categoriesLoading(categories);
    } catch (error) {
      return [];
    }

    return this.element;
  }

  productLoading(product) {
    const {description, discount, images, price, quantity, status, subcategory, title} = product[0];
    const {productForm, imageListContainer} = this.subElements;
    const formImage = imageListContainer.firstElementChild;

    productForm.title.value = title;
    productForm.description.value = description;
    images.map(image => formImage.append(this.setPhotoElement(image.source, image.url)));
    productForm.price.value = price;
    productForm.discount.value = discount;
    productForm.quantity.value = quantity;
    productForm.status.value = status;

    this.selectedSubcategory = subcategory;
  }

  categoriesLoading(categories) {
    const list = this.subElements.productForm.subcategory;
    for (const category of categories) {
      for (const subcategory of category.subcategories) {
        const selected = subcategory.id === this.selectedSubcategory ? 'selected' : '';
        list.innerHTML += `<option ${selected} value="${category.id}">${category.title} > ${subcategory.title}</option>`;
      }
    }
  }

  addListeners() {
    const {uploadImage, fileLoader, subcategory} = this.subElements.productForm.elements;

    uploadImage.addEventListener('click', this.callFileloader);
    fileLoader.addEventListener('change', this.uploadFile);
    subcategory.addEventListener('change', this.selectedElement);
    this.subElements.productForm.addEventListener('submit', this.sendDataToServer);
  }

  async getFetchData() {
    const productUrl = new URL('api/rest/products', BACKEND_URL);
    const categoryUrl = new URL('api/rest/categories', BACKEND_URL);

    productUrl.searchParams.set('id', this.id);
    categoryUrl.searchParams.set('_sort', 'weight');
    categoryUrl.searchParams.set('_refs', 'subcategory');

    const productResponse = fetchJson(productUrl);
    const categoriesResponse = fetchJson(categoryUrl);

    return await Promise.all([productResponse, categoriesResponse]);
  }

  remove() {
    const {uploadImage, fileLoader, subcategory} = this.subElements.productForm.elements;

    uploadImage.removeEventListener('click', this.callFileloader);
    fileLoader.removeEventListener('change', this.uploadFile);
    subcategory.removeEventListener('change', this.selectedElement);
    this.subElements.productForm.removeEventListener('submit', this.sendDataToServer);
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
