export default class NotificationMessage {
  static instance;
  element = null;

  constructor(message = '', {
    duration = 0,
    type = ''
  } = {}) {

    if (NotificationMessage.instance !== undefined) {
      NotificationMessage.instance.remove();
    }

    NotificationMessage.instance = this;

    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">${this.message}</div>
        </div>
      </div>
    `;

    this.element = element.firstElementChild;

  }

  show(parent = document.body) {
    parent.append(this.element);

    setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}

