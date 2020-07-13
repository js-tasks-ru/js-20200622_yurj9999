class Tooltip {
  element = null;

  showTooltip = (event) => {
    if (event.target.dataset.tooltip) {
      this.render(event.target.dataset.tooltip);
      this.element.setAttribute('style', `top: ${event.clientY}px; left: ${event.clientX}px;`);
      event.target.addEventListener('pointermove', this.updateTooltip);
    }
  }

  updateTooltip = (event) => {
    this.element.setAttribute('style', `top: ${event.clientY + 1}px; left: ${event.clientX + 1}px;`);
  }

  checkTooltipForRemove = (event) => {
    if (event.target.dataset.tooltip) {
      event.target.removeEventListener('pointermove', this.updateTooltip);
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
    document.addEventListener('pointerover', this.showTooltip);
    document.addEventListener('pointerout', this.checkTooltipForRemove);
  }

  destroy() {
    document.removeEventListener('pointerover', this.showTooltip);
    document.removeEventListener('pointerout', this.checkTooltipForRemove);
  }
}

const tooltip = new Tooltip();

export default tooltip;
