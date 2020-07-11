class Tooltip {
  element = null;
  targetForTooltip = null;
  tooltipIsCreated = false;

  _showTooltip = (event) => {
    if (event.target.dataset.hasOwnProperty('tooltip')) {
      this.render(event.target.dataset.tooltip);
      document.body.append(this.element);
      this.element.setAttribute('style', `top: ${event.clientY}px; left: ${event.clientX}px;`);
      this.targetForTooltip = event.target;
      this.targetForTooltip.addEventListener('pointermove', this._updateTooltip);
    }
  }

  _checkTooltipForRemove = () => {
    if (this.tooltipIsCreated) {
      this.targetForTooltip.removeEventListener('pointermove', this._updateTooltip);
      this.element.remove();
    }
  }

  _updateTooltip = (event) => {
    this.element.setAttribute('style', `top: ${event.clientY + 1}px; left: ${event.clientX + 1}px;`);
  }

  initialize() {
    document.addEventListener('pointerover', this._showTooltip);
    document.addEventListener('pointerout', this._checkTooltipForRemove);
  }

  render(text = '') {
    const tooltip = document.createElement('div');
    tooltip.innerHTML = `<div class="tooltip">${text}</div>`;
    this.element = tooltip.firstElementChild;
    this.tooltipIsCreated = true;
  }

  remove() {
    document.removeEventListener('pointerover', this._showTooltip);
    document.removeEventListener('pointerout', this._checkTooltipForRemove);
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
