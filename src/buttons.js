import di from '@csgis/di';
import commons from './commons';

class Button {
  constructor(opts) {
    this.createUI(opts);
    this.wire(opts);
  }

  createUI(opts) {
    this.elem = commons.getOrCreateElem('div', {
      id: opts.id,
      parent: opts.parent,
      css: opts.css,
      priority: opts.priority
    });

    if (opts.tooltip) {
      this.elem.title = opts.tooltip;
    }

    this.elem.classList.add('button-enabled');

    let iconDiv = commons.getOrCreateElem('div', {
      parent: this.elem,
      html: opts.html || opts.text,
      css: 'button-content'
    });

    if (opts.image) {
      iconDiv.style['background-image'] = 'url(' + opts.image + ')';
    }
  }

  wire(opts) {
    const bus = di.get('bus');

    this.elem.addEventListener('click', (e) => {
      if (!this.elem.classList.contains('button-enabled')) return;

      e.stopPropagation();

      if (opts.clickEventName) {
        bus.send(opts.clickEventName, opts.clickEventMessage);
      } else if (opts.clickEventCallback) {
        opts.clickEventCallback(this.elem);
      }
    });

    bus.listen('ui-button:' + opts.id + ':enable', (e, enabled) => this.enable(enabled));
    bus.listen('ui-button:' + opts.id + ':activate', (e, active) => this.activate(active));
    bus.listen('ui-button:' + opts.id + ':toggle', () => this.toggle());
    bus.listen('ui-button:' + opts.id + ':link-active', (event, linkedDiv) => {
      bus.listen('ui-show', (e, id) => {
        if (linkedDiv === id) {
          this.activate(true);
        }
      });
      bus.listen('ui-hide', (e, id) => {
        if (linkedDiv === id) {
          this.activate(false);
        }
      });
      bus.listen('ui-toggle', (e, id) => {
        if (linkedDiv === id) {
          this.toggle();
        }
      });
    });
  }

  enable(enabled) {
    if (enabled !== undefined && !enabled) {
      this.elem.classList.remove('button-enabled');
      this.elem.classList.add('button-disabled');
    } else {
      this.elem.classList.add('button-enabled');
      this.elem.classList.remove('button-disabled');
    }
  }

  activate(active) {
    if (active !== undefined && !active) {
      this.elem.classList.remove('button-active');
    } else {
      this.elem.classList.add('button-active');
    }
  }

  toggle() {
    if (this.elem.classList.contains('button-active')) {
      this.elem.classList.remove('button-active');
    } else {
      this.elem.classList.add('button-active');
    }
  }
}

export default (opts) => new Button(opts).elem;
