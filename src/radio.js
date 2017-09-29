import commons from './commons';

class Radio {
  constructor(opts) {
    let container = commons.createContainer(opts.id, opts.parent, opts.css);

    this.input = commons.getOrCreateElem('input', {
      id: opts.id,
      parent: container,
      css: (opts.css || '') + ' ui-radio'
    });

    commons.linkDisplay(this.input, container);

    if (opts.parent) {
      let name;
      if (typeof opts.parent !== 'string') {
        name = opts.parent.id;
      } else {
        name = opts.parent;
      }
      this.input.name = name;
    }

    this.input.type = 'radio';

    let label = commons.createLabel(opts.id, container, opts.label);
    label.addEventListener('click', () => this.input.click());
  }
}

export default (props) => new Radio(props).input;
