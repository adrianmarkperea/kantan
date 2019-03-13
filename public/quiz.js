function Quiz(el, entryItems = []) {
  this.el = el;
  this.cardEl = el.querySelector('.flash-card');
  this.titleEl = el.querySelector('.card-header-title');
  this.textEl = el.querySelector('.card-text');
  this.previousCardEl = el.querySelector('[data-action="previous-card"]');
  this.nextCardEl = el.querySelector('[data-action="next-card"]');
  this.currentItemEl = el.querySelector('#current-card-number');
  this.maxItemEl = el.querySelector('#max-card-number');

  this.entryItems = entryItems;
  this.maxItems = entryItems.length;
  this.maxItemEl.innerHTML = this.maxItems;

  this.currentIndex = 0;
  this.isShowingBackSide = false;

  this.cardEl.addEventListener('click', this.flip.bind(this));
  this.previousCardEl.addEventListener('click', this.getPreviousItem.bind(this));
  this.nextCardEl.addEventListener('click', this.getNextItem.bind(this));
}

Quiz.prototype.getEntryItems = function() {
  return this.entryItems;
}

Quiz.prototype.getPreviousItem = function() {
  this.currentIndex--;

  this.currentIndex = this.currentIndex < 0
    ? this.maxItems - 1
    : this.currentIndex;

  this.setShowingBackSide(false);
  this.render();
}

Quiz.prototype.getNextItem = function() {
  this.currentIndex = (this.currentIndex + 1) % this.maxItems; 
  this.setShowingBackSide(false);
  this.render();
}

Quiz.prototype.setShowingBackSide = function(isShowingBackSide) {
  this.isShowingBackSide = isShowingBackSide;
}

Quiz.prototype.flip = function() {
  this.isShowingBackSide = !this.isShowingBackSide;
  this.render();
}

Quiz.prototype.render = function() {
  const entryItem = this.entryItems[this.currentIndex];

  this.titleEl.innerHTML = this.isShowingBackSide
    ? 'Back'
    : 'Front';

  this.textEl.innerHTML = this.isShowingBackSide
    ? entryItem.back
    : entryItem.front;

  this.currentItemEl.innerHTML = this.currentIndex + 1;
}
