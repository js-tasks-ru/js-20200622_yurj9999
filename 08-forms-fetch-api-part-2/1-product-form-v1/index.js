import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const IMGUR_URL = 'https://api.imgur.com';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element = null;
  subElements = {};
  selectedSubcategory = '';
  formData = {};
  categoriesList = [];
  saveButtonCaption = '';
  isUpdated = false;

  // метод обработки ошибок
  errorHandler = () => {
    return [];
  }

  callFileloader = () => {
    this.subElements.productForm.elements.fileLoader.click();
  }

  uploadFile = async (event) => {
    const img = event.target.files[0];
    const formData = new FormData();
    formData.append('image', img, img.name);

    try {
      const imgUploadResponse = await fetchJson(new URL('3/image', IMGUR_URL), {
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
        },
        method: 'POST',
        body: formData
      });
      this.subElements.imageListContainer.firstElementChild.append(this.setPhotoElement(img.name, imgUploadResponse.data.link));
    } catch (error) {
      return this.errorHandler();
    }
  }

  selectedElement = (event) => {
    this.selectedSubcategory = event.target.value;
  }

  sendDataToServer = async (event) => {
    event.preventDefault();

    const {productForm, imageListContainer} = this.subElements;
    const {title, description, price, discount, quantity, status} = productForm;

    const preparedData = {
      description: description.value,
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
      this.isUpdated = false;
    } else {
      this.isUpdated = true;
    }

    try {
      const result = await fetchJson(new URL('api/rest/products', BACKEND_URL), {
        headers: {
          'Content-Type': 'application/json'
        },
        method: this.isUpdated ? 'PUT' : 'PATCH',
        body: JSON.stringify(preparedData)
      });

      this.id = result.id;
      //this.updateDom();

      this.isUpdated ? this.update() : this.save();

    } catch (error) {
      return this.errorHandler();
    }
  }

  constructor(id = '') {
    this.id = id;
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

    //this.updateDom();

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
                <button type="submit" name="save" class="button-primary-outline">${this.saveButtonCaption}</button>
            </div>

        </form>
    </div>`;

    this.element = element.firstElementChild;

    this.getSubElements(this.element);
    this.addListeners();
    await Promise.resolve(this.updateDom());

    return this.element;
  }

  addListeners() {
    const {productForm} = this.subElements;
    const {uploadImage, fileLoader, subcategory} = productForm.elements;

    window.addEventListener('unhandledrejection', this.errorHandler);
    uploadImage.addEventListener('click', this.callFileloader);
    fileLoader.addEventListener('change', this.uploadFile);
    subcategory.addEventListener('change', this.selectedElement);
    productForm.addEventListener('submit', this.sendDataToServer);
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

  setSubcategoriesList(data, parentTitle) {
    data.forEach((category) => {
      const isIdentCategory = this.id && category.id.includes(this.formData.subcategory);
      if (isIdentCategory) {
        this.selectedSubcategory = category.id;
      }
      this.categoriesList.push(`<option ${isIdentCategory ? 'selected' : ''} value="${category.id}">${parentTitle} > ${category.title}</option>`);
    });
  }

  async preparedData() {
    try {
      const result = await this.getFetchData();
      const productData = await result[0];
      const categoriesData = await result[1];
      if (productData.length) {
        this.formData = {...productData[0]};
      }
      categoriesData.forEach((item) => {
        const {subcategories, title} = item;
        this.setSubcategoriesList(subcategories, title);
      });
      return this.formData;
    } catch (error) {
      return this.errorHandler();
    }
  }

  async updateDom() {
    try {
      const formData = await this.preparedData();

      const {productForm, imageListContainer} = this.subElements;
      const {title, description, subcategory, price, discount, quantity, status, save} = productForm;

      title.value = this.id ? formData.title : '';
      description.value = this.id ? formData.description : '';
      price.value = this.id ? formData.price : 100;
      discount.value = this.id ? formData.discount : 0;
      quantity.value = this.id ? formData.quantity : 1;
      status.value = this.id ? formData.status : 1;
      save.textContent = this.id ? 'Сохранить товар' : 'Добавить товар';

      subcategory.innerHTML = this.categoriesList.map(item => item).join('');

      if (this.id) {
        formData.images.forEach((image) => imageListContainer.firstElementChild.append(this.setPhotoElement(image.source, image.url)));
      }

    } catch (error) {
      return this.errorHandler();
    }
  }

  remove() {
    const {productForm} = this.subElements;
    const {uploadImage, fileLoader, subcategory} = productForm.elements;

    window.removeEventListener('unhandledrejection', this.errorHandler);
    productForm.removeEventListener('submit', this.sendDataToServer);
    uploadImage.removeEventListener('click', this.callFileloader);
    fileLoader.removeEventListener('change', this.uploadFile);
    subcategory.removeEventListener('change', this.selectedElement);

    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
