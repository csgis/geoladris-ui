import commons from './commons';
import di from '@csgis/di';
import $ from 'jquery';

const ATTR_DIRECTION = 'gb-ui-sliding-direction';
const HANDLE_CLASS = 'ui-sliding-div-handle';

let bus;
let duration;

function expand(id) {
  let div = document.getElementById(id);
  let direction = div.getAttribute(ATTR_DIRECTION);
  let handle = div.parentNode.getElementsByClassName(HANDLE_CLASS)[0];

  let opts = {};
  if (direction === 'horizontal' || direction === 'both') {
    opts.width = 'show';
  }
  if (direction === 'vertical' || direction === 'both') {
    opts.height = 'show';
  }

  $(div).animate(opts, duration);
  handle.innerHTML = '-';
}

function collapse(id) {
  let div = document.getElementById(id);
  let direction = div.getAttribute(ATTR_DIRECTION);
  let handle = div.parentNode.getElementsByClassName(HANDLE_CLASS)[0];

  let opts = {};
  if (direction === 'horizontal' || direction === 'both') {
    opts.width = 'hide';
  }
  if (direction === 'vertical' || direction === 'both') {
    opts.height = 'hide';
  }

  $(div).animate(opts, duration);
  handle.innerHTML = '+';
}

function toggle(id) {
  let div = document.getElementById(id);
  let handle = div.parentNode.getElementsByClassName(HANDLE_CLASS)[0];

  if (handle.innerHTML === '+') {
    expand(id, duration);
  } else {
    collapse(id, duration);
  }
}

class SlidingDiv {
  constructor(opts) {
    this.createUI(opts);
    this.wire(opts);
  }

  createUI(opts) {
    let direction = opts.direction || 'vertical';
    let handlePosition = opts.handlePosition || 'bottom';

    // Container
    let containerId = opts.id + '-container';
    let container = commons.getOrCreateElem('div', {
      id: containerId,
      parent: opts.parent,
      css: 'ui-sliding-div-container'
    });

    // Handle div
    this.handle = commons.getOrCreateElem('div', {
      css: HANDLE_CLASS + ' ' + handlePosition,
      html: opts.visible ? '-' : '+'
    });

    if (handlePosition === 'bottom-left' || handlePosition === 'top' || handlePosition === 'top-left' || handlePosition === 'left') {
      container.appendChild(this.handle);
    }

    // Content div
    this.div = commons.getOrCreateElem('div', {
      id: opts.id,
      parent: containerId,
      css: 'ui-sliding-div-content'
    });
    this.div.setAttribute(ATTR_DIRECTION, direction);

    if (!opts.visible) {
      this.div.style.display = 'none';
    }

    if (handlePosition === 'bottom' || handlePosition === 'bottom-right' || handlePosition === 'right' || handlePosition === 'top-right') {
      container.appendChild(this.handle);
    }

    if (handlePosition !== 'top' && handlePosition !== 'bottom') {
      this.div.style.float = 'left';
    }
  }

  wire(opts) {
    this.handle.addEventListener('click', ()  => toggle(opts.id));

    if (!bus) {
      duration = opts.duration || 0;
      bus = di.get('bus');
      bus.listen('ui-sliding-div:collapse', (e, id) => collapse(id));
      bus.listen('ui-sliding-div:expand', (e, id) => expand(id));
      bus.listen('ui-sliding-div:toggle', (e, id) => toggle(id));
    }
  }
}

export default (opts) => new SlidingDiv(opts).div;
