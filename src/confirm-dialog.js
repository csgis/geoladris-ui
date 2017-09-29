import di from '@csgis/di';
import commons from './commons';
import dialogs from './dialog';
import buttons from './buttons';

class ConfirmDialog {
  constructor(opts) {
    this.createUI(opts);
    this.wire();
  }

  createUI(opts) {
    opts.modal = true;
    opts.css = (opts.css || '') + ' ui-confirm-dialog';
    if (!opts.messages) {
      opts.messages = {};
    }

    this.elem = dialogs(opts);

    if (opts.messages.question) {
      commons.getOrCreateElem('div', {
        id: opts.id + '-message',
        parent: opts.id,
        css: 'ui-confirm-dialog-message',
        html: opts.messages.question
      });
    }

    let buttonsContainer = opts.id + '-confirm-buttons-container';
    commons.getOrCreateElem('div', {
      id: buttonsContainer,
      parent: opts.id,
      css: 'ui-confirm-dialog-buttons-container'
    });
    buttons({
      id: opts.id + '-ok',
      parent: buttonsContainer,
      css: 'dialog-ok-button ui-confirm-dialog-ok',
      text: opts.messages.ok,
      clickEventName: 'ui-confirm-dialog:' + opts.id + ':ok'
    });
    buttons({
      id: opts.id + '-cancel',
      parent: buttonsContainer,
      css: 'dialog-ok-button ui-confirm-dialog-cancel',
      text: opts.messages.cancel,
      clickEventName: 'ui-confirm-dialog:' + opts.id + ':cancel'
    });
  }

  wire() {
    const bus = di.get('bus');

    let id = this.elem.id;
    let hide = () =>  bus.send('ui-hide', id);
    bus.listen('ui-confirm-dialog:' + id + ':cancel', hide);
    bus.listen('ui-confirm-dialog:' + id + ':ok', hide);
  }
}

export default (opts) => new ConfirmDialog(opts).elem;
