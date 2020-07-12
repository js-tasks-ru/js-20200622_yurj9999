class Tooltip {
  element = null;

  _showTooltip = (event) => {
    if (event.target.dataset.hasOwnProperty('tooltip')) {
      this.render(event.target.dataset.tooltip);
      this.element.setAttribute('style', `top: ${event.clientY}px; left: ${event.clientX}px;`);
      event.target.addEventListener('pointermove', this._updateTooltip);
    }
  }

  _updateTooltip = (event) => {
    this.element.setAttribute('style', `top: ${event.clientY + 1}px; left: ${event.clientX + 1}px;`);
  }

  _checkTooltipForRemove = (event) => {
    if (event.target.dataset.hasOwnProperty('tooltip')) {
      event.target.removeEventListener('pointermove', this._updateTooltip);
      this.element.remove();
      this.element = null;
    }
  }

  render(text = '') {
    const tooltip = document.createElement('div');
    tooltip.innerHTML = `<div class="tooltip">${text}</div>`;
    this.element = tooltip.firstElementChild;
    document.body.append(this.element);
  }

  initialize() {
    document.addEventListener('pointerover', this._showTooltip);
    document.addEventListener('pointerout', this._checkTooltipForRemove);
  }

  destroy() {
    document.removeEventListener('pointerover', this._showTooltip);
    document.removeEventListener('pointerout', this._checkTooltipForRemove);
  }
}

const tooltip = new Tooltip();

export default tooltip;
