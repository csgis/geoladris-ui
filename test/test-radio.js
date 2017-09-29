import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import commons from '../src/commons';
import module from '../src/radio';

describe('radio', function () {
  di.bind('bus', bus);
  commons.linkDisplay = sinon.spy(commons, 'linkDisplay');
  beforeEach(utils.replaceParent);

  it('creates a radio button', function () {
    let input = module({
      id: 'myitem',
      text: 'Item 1',
      parent: utils.PARENT_ID
    });

    assert(input);
    assert.equal('radio', input.type);
    assert.equal(utils.PARENT_ID, input.name);
    assert.equal('myitem', input.id);

    let container = document.getElementById(utils.PARENT_ID).getElementsByClassName('ui-input-container')[0];
    assert.equal(1, container.querySelectorAll('.ui-radio').length);
    assert.equal(1, container.querySelectorAll('.ui-label').length);
  });

  it('clicks input on text clicked', function () {
    let input = module({
      id: 'myitem',
      parent: utils.PARENT_ID,
      text: 'Item 1'
    });

    let clicked;
    input.addEventListener('click', function () {
      clicked = true;
    });

    let text = document.getElementById(utils.PARENT_ID).querySelector('.ui-label');
    text.click();
    assert(clicked);
  });

  it('links container visibility', function () {
    let input = module({
      id: 'myitem',
      parent: utils.PARENT_ID,
      text: 'Item 1'
    });

    let spy = commons.linkDisplay;
    assert(spy.called);
    let args = spy.getCall(spy.callCount - 1).args;
    assert.equal(input.id, args[0].id);
    assert.equal(input.id + '-container', args[1].id);
  });
});
