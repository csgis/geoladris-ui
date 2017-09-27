import bus from '@geoladris/event-bus';
import di from '@csgis/di';
import sinon from 'sinon';
import {
	replaceParent
} from './utils';
import buttons from '../src/buttons';
import assert from 'assert';

const PARENT_ID = 'myparent';

describe('buttons', function() {
	di.bind('bus', bus);
	bus.send = sinon.spy(bus, 'send');
	beforeEach(() => replaceParent(PARENT_ID));

	it('creates a <div> if text specified', function() {
		var button = buttons({
			id: 'mybutton',
			parent: PARENT_ID,
			text: 'Click!'
		}, di);
		assert.equal('DIV', button.tagName);
		assert.equal('Click!', button.querySelector('div').innerHTML);
	});

	it('uses html property for button text', function() {
		var button = buttons({
			id: 'mybutton',
			parent: PARENT_ID,
			html: 'Click!'
		}, di);
		assert.equal('DIV', button.tagName);
		assert.notEqual(0, button.innerHTML.indexOf('Click!'));
		assert.equal('Click!', button.querySelector('div').innerHTML);
	});

	it('creates a <div> if image specified', function() {
		var button = buttons({
			id: 'mybutton',
			parent: PARENT_ID,
			image: 'url_to_image'
		}, di);
		assert.equal('DIV', button.tagName);
		var content = button.querySelector('div');
		assert.notEqual(-1, content.style['background-image'].indexOf('url_to_image'));
	});

	it('creates a <div> with text and image if both specified', function() {
		var button = buttons({
			id: 'mybutton',
			parent: PARENT_ID,
			image: 'url_to_image',
			text: 'Click!'
		}, di);

		var iconDiv = button.children[0];
		assert.equal('Click!', iconDiv.innerHTML);
		assert.notEqual(-1, iconDiv.style['background-image'].indexOf('url_to_image'));
	});

	it('adds a tooltip if specified on create', function() {
		var tooltip = 'Click me';
		var button = buttons({
			id: 'mybutton',
			parent: PARENT_ID,
			img: 'url_to_image',
			tooltip: tooltip
		}, di);
		assert.equal(tooltip, button.title);
	});

	it('creates the button with the default css classes', function() {
		var button = buttons({
			id: 'mybutton',
			parent: PARENT_ID,
			img: 'url_to_image'
		}, di);

		assert(button.className.match('button-enabled'));
		assert(!button.className.match('button-disabled'));
		assert(!button.className.match('button-active'));
	});

	it('sets button to correct position if priority specified on create', function() {
		var button1 = buttons({
			id: 'mybutton1',
			parent: PARENT_ID,
			priority: 2
		}, di);
		var button2 = buttons({
			id: 'mybutton2',
			parent: PARENT_ID,
			priority: 1
		}, di);

		var parent = document.getElementById(PARENT_ID);
		assert.equal(button2, parent.children[0]);
		assert.equal(button1, parent.children[1]);
	});

	it('sends event on click if clickEventName specified on create', function() {
		var event = 'event-name';
		var eventMessage = {
			data: 'This is the message'
		};
		var button = buttons({
			id: 'mybutton',
			parent: PARENT_ID,
			img: 'url_to_image',
			clickEventName: event,
			clickEventMessage: eventMessage
		}, di);

		button.click();

		sinon.assert.calledWith(bus.send, event, eventMessage);
	});

	it('calls callback on click if clickEventCallback specified on create', function() {
		var clicked;
		var button = buttons({
			id: 'mybutton',
			parent: PARENT_ID,
			img: 'url_to_image',
			clickEventCallback: function() {
				clicked = true;
			}
		}, di);

		button.click();
		assert(clicked);
	});

	it('enables button on ui-button:enable', function() {
		var button = buttons({
			id: 'mybutton',
			parent: PARENT_ID
		}, di);

		button.className = 'button-disabled';

		bus.send('ui-button:mybutton:enable', true);
		assert(!button.className.match('button-disabled'));
		assert(button.className.match('button-enabled'));
	});

	it('disables button on ui-button:disable', function() {
		var button = buttons({
			id: 'mybutton',
			parent: PARENT_ID
		}, di);

		bus.send('ui-button:mybutton:enable', false);
		assert(button.className.match('button-disabled'));
		assert(!button.className.match('button-enabled'));
	});

	it('changes css on deactivate/activate events', function() {
		var button = buttons({
			id: 'mybutton',
			parent: PARENT_ID
		}, di);

		assert(!button.className.match('button-active'));
		bus.send('ui-button:mybutton:activate', true);
		assert(button.className.match('button-active'));
		bus.send('ui-button:mybutton:activate', false);
		assert(!button.className.match('button-active'));
	});

	it('changes css on toggle events', function() {
		var button = buttons({
			id: 'mybutton',
			parent: PARENT_ID
		}, di);

		assert(!button.className.match('button-active'));
		bus.send('ui-button:mybutton:toggle');
		assert(button.className.match('button-active'));
		bus.send('ui-button:mybutton:toggle');
		assert(!button.className.match('button-active'));
	});

	it('does not add css classes more than once', function() {
		var button = buttons({
			id: 'mybutton',
			parent: PARENT_ID
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
