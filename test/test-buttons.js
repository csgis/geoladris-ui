import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import buttons from '../src/buttons';

describe('buttons', function() {
	di.bind('bus', bus);
	bus.send = sinon.spy(bus, 'send');
	beforeEach(utils.replaceParent);

	it('creates a <div> if text specified', function() {
		let button = buttons({
			id: 'mybutton',
			parent: utils.PARENT_ID,
			text: 'Click!'
		}, di);
		assert.equal('DIV', button.tagName);
		assert.equal('Click!', button.querySelector('div').innerHTML);
	});

	it('uses html property for button text', function() {
		let button = buttons({
			id: 'mybutton',
			parent: utils.PARENT_ID,
			html: 'Click!'
		}, di);
		assert.equal('DIV', button.tagName);
		assert.notEqual(0, button.innerHTML.indexOf('Click!'));
		assert.equal('Click!', button.querySelector('div').innerHTML);
	});

	it('creates a <div> if image specified', function() {
		let button = buttons({
			id: 'mybutton',
			parent: utils.PARENT_ID,
			image: 'url_to_image'
		}, di);
		assert.equal('DIV', button.tagName);
		let content = button.querySelector('div');
		assert.notEqual(-1, content.style['background-image'].indexOf('url_to_image'));
	});

	it('creates a <div> with text and image if both specified', function() {
		let button = buttons({
			id: 'mybutton',
			parent: utils.PARENT_ID,
			image: 'url_to_image',
			text: 'Click!'
		}, di);

		let iconDiv = button.children[0];
		assert.equal('Click!', iconDiv.innerHTML);
		assert.notEqual(-1, iconDiv.style['background-image'].indexOf('url_to_image'));
	});

	it('adds a tooltip if specified on create', function() {
		let tooltip = 'Click me';
		let button = buttons({
			id: 'mybutton',
			parent: utils.PARENT_ID,
			img: 'url_to_image',
			tooltip: tooltip
		}, di);
		assert.equal(tooltip, button.title);
	});

	it('creates the button with the default css classes', function() {
		let button = buttons({
			id: 'mybutton',
			parent: utils.PARENT_ID,
			img: 'url_to_image'
		}, di);

		assert(button.className.match('button-enabled'));
		assert(!button.className.match('button-disabled'));
		assert(!button.className.match('button-active'));
	});

	it('sets button to correct position if priority specified on create', function() {
		let button1 = buttons({
			id: 'mybutton1',
			parent: utils.PARENT_ID,
			priority: 2
		}, di);
		let button2 = buttons({
			id: 'mybutton2',
			parent: utils.PARENT_ID,
			priority: 1
		}, di);

		let parent = document.getElementById(utils.PARENT_ID);
		assert.equal(button2, parent.children[0]);
		assert.equal(button1, parent.children[1]);
	});

	it('sends event on click if clickEventName specified on create', function() {
		let event = 'event-name';
		let eventMessage = {
			data: 'This is the message'
		};
		let button = buttons({
			id: 'mybutton',
			parent: utils.PARENT_ID,
			img: 'url_to_image',
			clickEventName: event,
			clickEventMessage: eventMessage
		}, di);

		button.click();

		sinon.assert.calledWith(bus.send, event, eventMessage);
	});

	it('calls callback on click if clickEventCallback specified on create', function() {
		let clicked;
		let button = buttons({
			id: 'mybutton',
			parent: utils.PARENT_ID,
			img: 'url_to_image',
			clickEventCallback: function() {
				clicked = true;
			}
		}, di);

		button.click();
		assert(clicked);
	});

	it('enables button on ui-button:enable', function() {
		let button = buttons({
			id: 'mybutton',
			parent: utils.PARENT_ID
		}, di);

		button.className = 'button-disabled';

		bus.send('ui-button:mybutton:enable', true);
		assert(!button.className.match('button-disabled'));
		assert(button.className.match('button-enabled'));
	});

	it('disables button on ui-button:disable', function() {
		let button = buttons({
			id: 'mybutton',
			parent: utils.PARENT_ID
		}, di);

		bus.send('ui-button:mybutton:enable', false);
		assert(button.className.match('button-disabled'));
		assert(!button.className.match('button-enabled'));
	});

	it('changes css on deactivate/activate events', function() {
		let button = buttons({
			id: 'mybutton',
			parent: utils.PARENT_ID
		}, di);

		assert(!button.className.match('button-active'));
		bus.send('ui-button:mybutton:activate', true);
		assert(button.className.match('button-active'));
		bus.send('ui-button:mybutton:activate', false);
		assert(!button.className.match('button-active'));
	});

	it('changes css on toggle events', function() {
		let button = buttons({
			id: 'mybutton',
			parent: utils.PARENT_ID
		}, di);

		assert(!button.className.match('button-active'));
		bus.send('ui-button:mybutton:toggle');
		assert(button.className.match('button-active'));
		bus.send('ui-button:mybutton:toggle');
		assert(!button.className.match('button-active'));
	});

	it('does not add css classes more than once', function() {
		let button = buttons({
			id: 'mybutton',
			parent: utils.PARENT_ID
		}, di);

		assert.equal('button-enabled', button.className);
		bus.send('ui-button:mybutton:activate');
		bus.send('ui-button:mybutton:activate');
		assert.equal('button-enabled button-active', button.className);
		bus.send('ui-button:mybutton:enable');
		bus.send('ui-button:mybutton:enable');
		assert.equal('button-enabled button-active', button.className);
	});
});
