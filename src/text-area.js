import di from '@csgis/di';
import commons from './commons';

class TextArea {
  constructor(opts) {
    let container = commons.createContainer(opts.id, opts.parent, opts.css);
    commons.createLabel(opts.id, container, opts.label);
    let input = commons.getOrCreateElem('textarea', {
      id: opts.id,
      parent: container,
      css: opts.css + ' ui-textarea'
    });

    input.cols = opts.cols;
    input.rows = opts.rows;

    commons.linkDisplay(input, container);

    this.input = input;
    di.get('bus').listen(opts.id + '-field-value-fill', (e, message) => {
      message[opts.id] = input.value;
    });
  }
}

export default (opts) => new TextArea(opts).input;
