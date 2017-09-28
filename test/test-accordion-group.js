import * as utils from './utils';
import sinon from 'sinon';
import assert from 'assert';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import module from '../src/accordion-group';

const GROUP_ID = 'mygroup';

describe('accordion-group', function() {
	di.bind('bus', bus);
	bus.send = sinon.spy(bus, 'send');

	beforeEach(function() {
		bus.stopListenAll();
		utils.replaceParent();
	});

	function initGroup(visible) {
		module({
			id: GROUP_ID,
			parent: utils.PARENT_ID,
			title: 'Accordion Group 1',
			visible: visible
		});
	}

	function header() {
		return document.getElementById(GROUP_ID + '-header');
	}

	function content() {
		return document.getElementById(GROUP_ID);
	}

	it('adds header on create', function() {
		let title = 'Accordion Group 1';
		module({
			id: 'mygroup',
			parent: utils.PARENT_ID,
			title: title
		});

		let container = document.getElementById(utils.PARENT_ID).children[0];
		let h = document.getElementById('mygroup-header');
		assert(container.children.length === 2);
		assert(h.parentNode === container);
		assert(h !== null);
		assert(h.classList.contains('accordion-header'));
		assert(h.querySelector('p').classList.contains('accordion-header-text'));
		assert(h.textContent === title);
	});

	it('adds container on create', function() {
		initGroup();

		let container = document.getElementById(utils.PARENT_ID).children[0];
		assert(container.children.length === 2);
		let c = document.getElementById('mygroup');
		assert(c !== null);
		assert(c.parentNode === container);
	});

	it('shows content if visible property on add-group', function() {
		initGroup(true);
		assert(content().style.display !== 'none');
	});

	it('ignores undefined properties on visibility', function() {
		initGroup(true);

		bus.send('ui-accordion:' + GROUP_ID + ':visibility', {});

		assert(header().style.visibility !== 'hidden');
		assert(content().style.visibility !== 'hidden');
	});

	it('updates header and content if specified on visibility', function() {
		initGroup();

		bus.send('ui-accordion-group:' + GROUP_ID + ':visibility', {
			header: false,
			content: false
		});

		sinon.assert.calledWith(bus.send, 'ui-hide', GROUP_ID);
		sinon.assert.calledWith(bus.send, 'ui-hide', GROUP_ID + '-header');
	});
});
