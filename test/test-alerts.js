import bus from '@geoladris/event-bus';
import di from '@csgis/di';
import {
	replaceParent
} from './utils';
import module from '../src/alerts';
import assert from 'assert';

const parentId = 'center';
// This comes from ui-alerts.js
const containerId = 'ui-alerts-container';

describe('alerts', function() {
	di.bind('bus', bus);

	// Init just once
	replaceParent(parentId);
	module({
		parentDiv: parentId
	}, di);

	beforeEach(function() {
		document.getElementById(containerId).innerHTML = '';
	});

	it('creates a container on init', function() {
		var container = document.getElementById(containerId);
		assert(container !== null);
		assert.equal(0, container.children.length);
	});

	it('adds a div to the container on ui-alert', function() {
		bus.send('ui-alert', {
			message: 'Message',
			severity: 'danger'
		});
		assert.equal(1, document.getElementById(containerId).children.length);
	});

	it('adds a close button to the alert div on ui-alert', function() {
		bus.send('ui-alert', {
			message: 'Message',
			severity: 'danger'
		});

		var container = document.getElementById(containerId);
		var alertDiv = container.children[0];
		assert.equal(1, alertDiv.children.length);
		assert.equal('ui-alerts-close', alertDiv.children[0].className);
	});

	it('set the specified message on ui-alert', function() {
		bus.send('ui-alert', {
			message: 'Message',
			severity: 'danger'
		});

		var container = document.getElementById(containerId);
		var alertDiv = container.children[0];
		assert(alertDiv.textContent === 'Message');
	});

	it('set css class on the alert div depending on the severity', function() {
		bus.send('ui-alert', {
			message: 'Message',
			severity: 'danger'
		});

		var container = document.getElementById(containerId);
		var alertDiv = container.children[0];
		assert(alertDiv.className.match('ui-alert-danger').length > 0);
	});
});
