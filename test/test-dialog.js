import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import module from '../src/confirm-dialog';

describe('dialog', function() {
	di.bind('bus', bus);
	bus.send = sinon.spy(bus, 'send');
	beforeEach(utils.replaceParent);

	it('creates div on create', function() {
		module({
			id: 'mydialog',
			parent: utils.PARENT_ID
		});

		let parent = document.getElementById(utils.PARENT_ID);
		assert.equal(1, parent.children.length);
		let container = parent.children[0];
		let dialog = document.getElementById('mydialog');
		assert(dialog);
		assert.equal(container, dialog.parentNode);
	});

	it('does not create the same dialog twice', function() {
		for (let i = 0; i < 10; i++) {
			module({
				id: 'mydialog',
				parent: utils.PARENT_ID
			});
		}

		let parent = document.getElementById(utils.PARENT_ID);
		assert.equal(1, parent.children.length);
	});

	it('hides the dialog on init if !visible specified', function() {
		module({
			id: 'mydialog',
			parent: utils.PARENT_ID
		});
		assert(bus.send.calledWith('ui-hide', 'mydialog'));
	});

	it('shows the dialog on init if visible specified', function() {
		module({
			id: 'mydialog',
			parent: utils.PARENT_ID,
			visible: true
		});
		assert(bus.send.calledWith('ui-show', 'mydialog'));
	});

	it('adds a shade behind the dialog if modal', function() {
		module({
			id: 'mydialog',
			parent: utils.PARENT_ID,
			modal: true
		});

		let parent = document.getElementById(utils.PARENT_ID);
		let container = parent.children[0];
		assert.notStrictEqual(container, document.getElementById('mydialog'));
		assert(container.className.match('dialog-modal'));
	});

	it('adds a title if specified', function() {
		let text = 'Dialog Title';
		module({
			id: 'mydialog',
			parent: utils.PARENT_ID,
			title: text
		});

		let title = document.getElementById('mydialog').querySelectorAll('.dialog-title');
		assert.equal(1, title.length);
		assert.equal(text, title[0].textContent);
	});

	it('adds a close button if specified', function() {
		module({
			id: 'mydialog',
			parent: utils.PARENT_ID,
			closeButton: true
		});

		let close = document.getElementById('mydialog').querySelectorAll('.dialog-close');
		assert.equal(1, close.length);
	});

	it('hides the dialog on close button clicked', function() {
		module({
			id: 'mydialog',
			parent: utils.PARENT_ID,
			closeButton: true
		});

		let close = document.getElementById('mydialog').querySelector('.dialog-close');
		close.click();
		assert(bus.send.calledWith('ui-hide', 'mydialog'));
	});

	it('hides the shade when dialog is hidden if modal', function() {
		module({
			id: 'mydialog',
			parent: utils.PARENT_ID,
			modal: true,
			visible: true
		});

		let modal = document.getElementById(utils.PARENT_ID).querySelector('.dialog-modal');
		assert.notEqual('none', modal.style.display);
		bus.send('ui-hide', 'mydialog');
		assert.equal('none', modal.style.display);
	});

	it('shows the shade when dialog is shown if modal', function() {
		module({
			id: 'mydialog',
			parent: utils.PARENT_ID,
			modal: true,
			visible: false
		});

		let modal = document.getElementById(utils.PARENT_ID).querySelector('.dialog-modal');
		assert.equal('none', modal.style.display);
		bus.send('ui-show', 'mydialog');
		assert.notEqual('none', modal.style.display);
	});

	it('toggles the shade when dialog is toggled if modal', function() {
		module({
			id: 'mydialog',
			parent: utils.PARENT_ID,
			modal: true,
			visible: true
		});

		let modal = document.getElementById(utils.PARENT_ID).querySelector('.dialog-modal');
		assert.notEqual('none', modal.style.display);
		bus.send('ui-toggle', 'mydialog');
		assert.equal('none', modal.style.display);
	});

	it('shows the latest dialog on top of the others when ui-show', function() {
		module({
			id: 'mydialog',
			parent: utils.PARENT_ID,
			visible: false
		});
		module({
			id: 'mydialog2',
			parent: utils.PARENT_ID,
			visible: false
		});

		let container1 = document.getElementById('mydialog').parentNode;
		let container2 = document.getElementById('mydialog2').parentNode;

		// Mock CSS rules
		container1.style.position = 'absolute';
		container2.style.position = 'absolute';
		container1.style['z-index'] = 2000;
		container2.style['z-index'] = 2000;
		container1.style.display = 'none';
		container2.style.display = 'none';

		bus.send('ui-show', 'mydialog');
		assert.equal('2000', container1.style['z-index']);
		assert.equal('2000', container2.style['z-index']);
		bus.send('ui-show', 'mydialog2');
		assert.equal('2000', container1.style['z-index']);
		assert.equal('2001', container2.style['z-index']);
		bus.send('ui-toggle', 'mydialog2');
		bus.send('ui-toggle', 'mydialog2');
		assert.equal('2002', container2.style['z-index']);
	});
});
