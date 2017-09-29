import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import module from '../src/confirm-dialog';

describe('confirm-dialog', function () {
  di.bind('bus', bus);
  bus.send = sinon.spy(bus, 'send');
  beforeEach(utils.replaceParent);

  it('creates a modal dialog', function () {
    let messages = {
      question: '??',
      ok: 'Yes',
      cancel: 'No'
    };
    module({
      id: 'mydialog',
      parent: utils.PARENT_ID,
      css: 'mydialog-class',
      modal: false,
      messages: messages
    }, di);

    let dialog = document.getElementById('mydialog');
    let container = dialog.parentNode;
    assert(dialog);
    assert.equal(1, container.children.length);
  });

  it('does not add an html with the question if not provided', function () {
    module({
      id: 'mydialog',
      parent: utils.PARENT_ID,
      css: 'mydialog-class',
      modal: false,
      messages: {
        ok: 'Yes',
        cancel: 'No'
      }
    }, di);

    assert(!document.getElementById('mydialog-message'));
  });

  it('hides the confirm dialog on ok', function () {
    module({
      id: 'mydialog',
      parent: utils.PARENT_ID
    }, di);

    bus.send('ui-confirm-dialog:mydialog:ok');
    assert(bus.send.calledWith('ui-hide', 'mydialog'));
  });

  it('hides the confirm dialog on cancel', function () {
    module({
      id: 'mydialog',
      parent: utils.PARENT_ID
    }, di);

    bus.send('ui-confirm-dialog:mydialog:cancel');
    assert(bus.send.calledWith('ui-hide', 'mydialog'));
  });
});
