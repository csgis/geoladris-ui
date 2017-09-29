import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import module from '../src/loading';

describe('loading', function () {
  di.bind('bus', bus);
  bus.send = sinon.spy(bus, 'send');
  before(() => module());
  beforeEach(utils.replaceParent);

  it('adds a hidden loading div on init', function () {
    // This comes from the ui-loading.js code
    var div = document.getElementById('wait-mask');
    assert(div);
    assert.equal('none', div.style.display);
  });

  it('shows the loading div on start', function () {
    bus.send('ui-loading:start', 'Message');
    var shade = document.getElementById('wait-mask');
    assert.notEqual('none', shade.style.display);
    var msg = document.getElementById('loading-msg');
    assert(msg.textContent.match('Message'));

    // Free timers
    bus.send('ui-loading:end', 'Message');
  });

  it('hides the loading div on end', function () {
    bus.send('ui-loading:start', 'Message');
    bus.send('ui-loading:end', 'Message');
    assert.equal('none', document.getElementById('wait-mask').style.display);
  });

  it('handles multiple starts/ends with the same message', function () {
    bus.send('ui-loading:start', 'Message');
    bus.send('ui-loading:start', 'Message');
    var shade = document.getElementById('wait-mask');
    assert.notEqual('none', shade.style.display);
    bus.send('ui-loading:end', 'Message');
    assert.notEqual('none', shade.style.display);
    bus.send('ui-loading:end', 'Message');
    assert.equal('none', shade.style.display);
  });
});
