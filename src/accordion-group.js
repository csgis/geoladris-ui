import di from '@csgis/di';
import commons from './commons';
import $ from 'jquery';

class AccordionGroup {
  constructor(opts) {
    this.createUI(opts);
    this.wire();
  }

  createUI(opts) {
    let containerCss = '';
    let headerCss = '';
    if (opts.css) {
      let classes = opts.css.split('\s+');
      containerCss = classes.map(a => a + '-container').join(' ');
      headerCss = classes.map(a => a + '-header').join(' ');
    }

    let container = commons.getOrCreateElem('div', {
      id: opts.id + '-container',
      parent: opts.parent,
      css: containerCss
    });

    this.header = commons.getOrCreateElem('div', {
      id: opts.id + '-header',
      parent: container,
      css: headerCss + ' accordion-header'
    });
    commons.getOrCreateElem('p', {
      parent: this.header,
      html: opts.title,
      css: 'accordion-header-text'
    });

    this.content = commons.getOrCreateElem('div', {
      id: opts.id,
      parent: container,
      css: (opts.css || '') + ' accordion-content'
    });

    this.content.style.display = opts.visible ? '' : 'none';
  }

  wire() {
    this.header.addEventListener('click', () => $(this.content).slideToggle({
      duration: 300
    }));

    let bus = di.get('bus');

    bus.listen('ui-accordion-group:' + this.content.id + ':visibility', (e, msg) => {
      if (msg.header !== undefined) {
        bus.send(msg.header ? 'ui-show' : 'ui-hide', this.header.id);
      }
      if (msg.content !== undefined) {
        bus.send(msg.content ? 'ui-show' : 'ui-hide', this.content.id);
      }
    });
  }
}

export default (props) => new AccordionGroup(props);
