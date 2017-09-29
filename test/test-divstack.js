import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import divstack from '../src/divstack';

describe('divstack', function () {
  di.bind('bus', bus);
  bus.send = sinon.spy(bus, 'send');
  beforeEach(utils.replaceParent);

  it('hides other divs of stack on create', function () {
    let ids = ['id1', 'id2', 'id3'];
    for (let i = 0; i < ids.length; i++) {
      let div = document.createElement('div');
      div.setAttribute('id', utils.PARENT_ID);
      document.getElementById(utils.PARENT_ID).appendChild(div);
    }

    divstack(ids);

    assert(bus.send.calledWith('ui-hide', 'id2'));
    assert(bus.send.calledWith('ui-hide', 'id3'));
  });

  it('hides other divs of stack on ui-show', function () {
    let ids = ['id1', 'id2', 'id3'];
    for (let i = 0; i < ids.length; i++) {
      let div = document.createElement('div');
      div.setAttribute('id', utils.PARENT_ID);
      document.getElementById(utils.PARENT_ID).appendChild(div);
    }

    divstack(ids);
    bus.send('ui-show', 'id3');
    assert(bus.send.calledWith('ui-hide', 'id1'));
    assert(bus.send.calledWith('ui-hide', 'id2'));
  });
});
