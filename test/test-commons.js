import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import commons from '../src/commons';

describe('commons', function () {
  di.bind('bus', bus);
  commons.linkDisplay = sinon.spy(commons, 'linkDisplay');
  beforeEach(utils.replaceParent);

  it('creates elements with no parent', function () {
    let div = commons.getOrCreateElem('div', {
      id: 'mybutton'
    });
    assert(div.parentNode === null);
  });

  it('creates elements specifying DOM element as parent', function () {
    let parent = document.getElementById(utils.PARENT_ID);
    let div = commons.getOrCreateElem('div', {
      id: 'mybutton',
      parent: parent
    });
    assert.equal(1, parent.children.length);
    assert.equal(div, parent.children[0]);
    assert.equal(parent, div.parentNode);
  });

  it('creates labels', function () {
    let label = commons.createLabel('mynumber', utils.PARENT_ID, 'Field: ', bus);

    assert.equal('mynumber-label', label.id);
    assert(label.classList.contains('ui-label'));
  });

  it('changes the label text on set-label', function () {
    let label = commons.createLabel('mynumber', utils.PARENT_ID, 'Field: ', bus);
    assert.equal('Field: ', label.innerHTML);
    bus.send('ui-input:mynumber:set-label', 'Field 2: ');
    assert.equal('Field 2: ', label.innerHTML);
  });

  it('links display of components', function (done) {
    let d1 = commons.getOrCreateElem('div', {
      id: 'd1',
      parent: utils.PARENT_ID
    });
    let d2 = commons.getOrCreateElem('div', {
      id: 'd2',
      parent: utils.PARENT_ID
    });

    commons.linkDisplay(d1, d2);

    assert.equal('', d1.style.display);
    assert.equal('', d2.style.display);

    d1.style.display = 'none';

		// MutationObservers are not called immediately; we wait a bit for it
    setTimeout(function () {
      assert.equal('none', d2.style.display);
      done();
    }, 1000);
  });
});
