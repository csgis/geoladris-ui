import assert from 'assert';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import module from '../src/alerts';

// This comes from alerts.js
const CONTAINER_ID = 'ui-alerts-container';

describe('alerts', function () {
  di.bind('bus', bus);

  before(function () {
    utils.replaceParent();
    module({
      parentDiv: utils.PARENT_ID
    });
  });
  beforeEach(function () {
    document.getElementById(CONTAINER_ID).innerHTML = '';
  });

  it('creates a container on init', function () {
    let container = document.getElementById(CONTAINER_ID);
    assert(container !== null);
    assert.equal(0, container.children.length);
  });

  it('adds a div to the container on ui-alert', function () {
    bus.send('ui-alert', {
      message: 'Message',
      severity: 'danger'
    });
    assert.equal(1, document.getElementById(CONTAINER_ID).children.length);
  });

  it('adds a close button to the alert div on ui-alert', function () {
    bus.send('ui-alert', {
      message: 'Message',
      severity: 'danger'
    });

    let container = document.getElementById(CONTAINER_ID);
    let alertDiv = container.children[0];
    assert.equal(1, alertDiv.children.length);
    assert.equal('ui-alerts-close', alertDiv.children[0].className);
  });

  it('set the specified message on ui-alert', function () {
    bus.send('ui-alert', {
      message: 'Message',
      severity: 'danger'
    });

    let container = document.getElementById(CONTAINER_ID);
    let alertDiv = container.children[0];
    assert(alertDiv.textContent === 'Message');
  });

  it('set css class on the alert div depending on the severity', function () {
    bus.send('ui-alert', {
      message: 'Message',
      severity: 'danger'
    });

    let container = document.getElementById(CONTAINER_ID);
    let alertDiv = container.children[0];
    assert(alertDiv.className.match('ui-alert-danger').length > 0);
  });
});
