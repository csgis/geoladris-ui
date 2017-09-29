import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import commons from '../src/commons';
import module from '../src/ui';

const ELEM_ID = 'myid';

describe('ui', function () {
  di.bind('bus', bus);
  bus.stopListenAll();
  let ui = module();

  commons.linkDisplay = sinon.spy(commons, 'linkDisplay');

  beforeEach(function () {
    utils.replaceParent();
    var e = document.createElement('div');
    e.id = ELEM_ID;
    document.getElementById(utils.PARENT_ID).appendChild(e);
  });

  let elem = () => document.getElementById(ELEM_ID);
  let elemDisplay = () => elem().style.display;

  it('changes element display on ui-show', function () {
    elem().style.display = 'none';
    bus.send('ui-show', ELEM_ID);
    assert.equal('', elemDisplay());
  });

  it('changes element display on ui-hide', function () {
    bus.send('ui-show', ELEM_ID);
    assert.equal('', elemDisplay());
    bus.send('ui-hide', ELEM_ID);
    assert.equal('none', elemDisplay());
  });

  it('changes element display on ui-toggle', function () {
    assert.notEqual('none', elemDisplay());
    bus.send('ui-toggle', ELEM_ID);
    assert.equal('none', elemDisplay());
  });

  it('creates Sortable on sortable', function () {
    // It doesn't change anything in the DOM. We just ensure that
    // the function is available
    ui.sortable(utils.PARENT_ID);
  });
});
