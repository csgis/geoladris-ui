import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import commons from '../src/commons';
import module from '../src/sliding-div';

describe('sliding-div', function () {
  di.bind('bus', bus);
  bus.stopListenAll();
  commons.linkDisplay = sinon.spy(commons, 'linkDisplay');
  beforeEach(utils.replaceParent);

  it('creates a handle and a content div within a container on create', function () {
    module({
      id: 'mysliding',
      parent: utils.PARENT_ID
    });

    let parent = document.getElementById(utils.PARENT_ID);
    assert.equal(1, parent.children.length);
    let container = parent.children[0];
    assert.equal(1, container.getElementsByClassName('ui-sliding-div-handle').length);
    assert.equal(1, container.getElementsByClassName('ui-sliding-div-content').length);
  });

  it('hides/shows the content when the handle is clicked', function () {
    module({
      id: 'mysliding',
      parent: utils.PARENT_ID
    });

    let parent = document.getElementById(utils.PARENT_ID);
    let container = parent.children[0];
    let handle = container.querySelector('.ui-sliding-div-handle');
    let content = document.getElementById('mysliding');
    assert.equal('none', content.style.display);
    handle.click();
    assert.notEqual('none', content.style.display);
  });

  it('shows on expand event', function () {
    let div = module({
      id: 'mysliding',
      parent: utils.PARENT_ID
    });

    assert.equal('none', div.style.display);
    bus.send('ui-sliding-div:expand', 'mysliding');
    assert.notEqual('none', div.style.display);
  });

  it('hides on collapse event', function () {
    let div = module({
      id: 'mysliding',
      parent: utils.PARENT_ID
    });

    let handle = div.parentNode.querySelector('.ui-sliding-div-handle');
    handle.click();

    assert.notEqual('none', div.style.display);
    bus.send('ui-sliding-div:collapse', 'mysliding');
    assert.equal('none', div.style.display);
  });

  it('toggles on toggle event', function () {
    let div = module({
      id: 'mysliding',
      parent: utils.PARENT_ID
    });

    assert.equal('none', div.style.display);
    bus.send('ui-sliding-div:toggle', 'mysliding');
    assert.notEqual('none', div.style.display);
    bus.send('ui-sliding-div:toggle', 'mysliding');
    assert.equal('none', div.style.display);
  });

  it('changes handle text when shown/hidden', function () {
    let div = module({
      id: 'mysliding',
      parent: utils.PARENT_ID
    });

    let handle = div.parentNode.querySelector('.ui-sliding-div-handle');

    assert.equal('+', handle.innerHTML);
    bus.send('ui-sliding-div:toggle', 'mysliding');
    assert.equal('-', handle.innerHTML);
    bus.send('ui-sliding-div:toggle', 'mysliding');
    assert.equal('+', handle.innerHTML);
  });

  it('adds the handlePosition property as CSS class', function () {
    let div = module({
      id: 'mysliding',
      parent: utils.PARENT_ID,
      handlePosition: 'bottom-left'
    });

    let handle = div.parentNode.querySelector('.ui-sliding-div-handle');
    assert(handle.className.match('bottom-left'));
  });

  it('shows expanded if visible is specified', function () {
    let div = module({
      id: 'mysliding',
      parent: utils.PARENT_ID,
      handlePosition: 'bottom-left',
      visible: true
    });

    assert.notEqual('none', div.style.display);
  });
});
