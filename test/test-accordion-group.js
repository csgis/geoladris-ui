import bus from '@geoladris/event-bus';
import di from '@csgis/di';
import { replaceParent } from './utils';
import sinon from 'sinon';
import module from '../src/accordion-group';
import assert from 'assert';

const parentId = 'myparent';
const groupId = 'mygroup';

describe('accordion-group', function() {
	di.bind('bus', bus);
	bus.send = sinon.spy(bus, 'send');

	beforeEach(function() {
		bus.stopListenAll();
		replaceParent(parentId);
	});

	function initGroup(visible) {
		module({
			id: groupId,
			parent: parentId,
			title: 'Accordion Group 1',
			visible: visible
		}, di);
	}

	function header() {
		return document.getElementById(groupId + '-header');
	}

	function content() {
		return document.getElementById(groupId);
	}

	it('adds header on create', function() {
		var title = 'Accordion Group 1';
		module({
			id: 'mygroup',
			parent: parentId,
			title: title
		}, di);

		var container = document.getElementById(parentId).children[0];
		var header = document.getElementById('mygroup-header');
		assert(container.children.length === 2);
		assert(header.parentNode === container);
		assert(header !== null);
		assert(header.classList.contains('accordion-header'));
		assert(header.querySelector('p').classList.contains('accordion-header-text'));
		assert(header.textContent === title);
	});

	it('adds container on create', function() {
		initGroup();

		var container = document.getElementById(parentId).children[0];
		assert(container.children.length === 2);
		var content = document.getElementById('mygroup');
		assert(content !== null);
		assert(content.parentNode === container);
	});

	it('shows content if visible property on add-group', function() {
		initGroup(true);
		assert(content().style.display !== 'none');
	});

	it('ignores undefined properties on visibility', function() {
		initGroup(true);

		bus.send('ui-accordion:' + groupId + ':visibility', {});

		assert(header().style.visibility !== 'hidden');
		assert(content().style.visibility !== 'hidden');
	});

	it('updates header and content if specified on visibility', function() {
		initGroup();

		bus.send('ui-accordion-group:' + groupId + ':visibility', {
			header: false,
			content: false
		});

		sinon.assert.calledWith(bus.send, 'ui-hide', groupId);
		sinon.assert.calledWith(bus.send, 'ui-hide', groupId + '-header');
	});
});
