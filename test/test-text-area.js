import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import commons from '../src/commons';
import textArea from '../src/text-area';

describe('sliding-div', function () {
  di.bind('bus', bus);
  bus.stopListenAll();
  commons.linkDisplay = sinon.spy(commons, 'linkDisplay');
  beforeEach(utils.replaceParent);

  it('creates a textarea with a label on create', function () {
    textArea({
      id: 'myarea',
      parent: utils.PARENT_ID,
      label: 'Text: '
    });

    var parent = document.getElementById(utils.PARENT_ID);
    assert.equal(1, parent.children.length);
    var container = parent.children[0];
    assert.equal(2, container.children.length);
    assert.equal(1, container.getElementsByTagName('textarea').length);
    assert.equal(1, container.getElementsByTagName('label').length);
    assert.equal('Text: ', container.getElementsByTagName('label')[0].textContent);
  });

  it('sets rows and cols if specified on create', function () {
    var area = textArea({
      id: 'myarea',
      parent: utils.PARENT_ID,
      label: 'Text: ',
      rows: 4,
      cols: 20
    });

    assert.equal(4, area.rows);
    assert.equal(20, area.cols);
  });

  it('fills message on -field-value-fill', function () {
    var area = textArea({
      id: 'myarea',
      parent: utils.PARENT_ID,
      label: 'Text: '
    });

    var content = 'This is the textarea content';
    area.value = content;

    var message = {};
    bus.send('myarea-field-value-fill', message);
    assert.equal(content, message.myarea);
  });

  it('links container visibility', function () {
    var area = textArea({
      id: 'myarea',
      parent: utils.PARENT_ID,
      label: 'Text: '
    });

    var spy = commons.linkDisplay;
    assert(spy.called);
    var args = spy.getCall(spy.callCount - 1).args;
    assert.equal(area.id, args[0].id);
    assert.equal(area.id + '-container', args[1].id);
  });
});
