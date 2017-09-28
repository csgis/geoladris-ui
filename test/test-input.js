import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';
import $ from 'jquery';

import module from '../src/input';
import commons from '../src/commons';

describe('input', function() {
	di.bind('bus', bus);
	bus.send = sinon.spy(bus, 'send');
	commons.linkDisplay = sinon.spy(commons, 'linkDisplay');
	beforeEach(utils.replaceParent);

	it('creates container with elements', function() {
		module({
			id: 'myinput',
			parent: utils.PARENT_ID
		});

		let parent = document.getElementById(utils.PARENT_ID);
		assert.equal(1, parent.children.length);
		let container = parent.children[0];
		let input = document.getElementById('myinput');
		assert(input);
		assert.equal(container, input.parentNode);
		assert.equal(1, container.getElementsByTagName('label').length);
	});

	it('adds label if specified on create', function() {
		let text = 'Input: ';
		let input = module({
			id: 'myinput',
			parent: utils.PARENT_ID,
			label: text
		});

		let label = input.parentNode.querySelector('label');
		assert(label);
		assert.equal(text, label.innerHTML);
	});

	it('sets input type if specified on create', function() {
		let input = module({
			id: 'myinput',
			parent: utils.PARENT_ID,
			type: 'password'
		});
		assert.equal('password', input.type);
	});

	it('fills message on -field-value-fill', function() {
		let inputText = 'Input Text';
		let input = module({
			id: 'myinput',
			parent: utils.PARENT_ID
		});
		input.value = inputText;

		let message = {};
		bus.send('myinput-field-value-fill', message);
		assert.equal(inputText, message.myinput);
	});

	it('adds step=any for number fields', function() {
		let input = module({
			id: 'myinput',
			type: 'number',
			parent: utils.PARENT_ID
		});
		assert.equal('any', input.step);
	});

	it('fills values with actual types (number, date,...) instead of strings', function() {
		let number = module({
			id: 'mynumber',
			type: 'number',
			parent: utils.PARENT_ID
		});
		let date = module({
			id: 'mydate',
			type: 'date',
			parent: utils.PARENT_ID
		});

		number.value = 57.6;
		date.value = '2016-06-10';

		let message = {};
		bus.send('mynumber-field-value-fill', message);
		assert.equal(57.6, message.mynumber);
		assert.equal('number', typeof message.mynumber);

		message = {};
		bus.send('mydate-field-value-fill', message);
		assert.equal('2016-06-10T00:00:00.000Z', message.mydate);
		assert.equal('string', typeof message.mydate);
	});

	it('sets placeholder if specified', function() {
		let placeholder = 'Search...';
		let input = module({
			id: 'myinput',
			parent: utils.PARENT_ID,
			placeholder: placeholder
		});

		assert.equal(placeholder, input.getAttribute('placeholder'));
	});

	it('sends event on enter for autocomplete', function() {
		let input = module({
			id: 'myinput',
			parent: utils.PARENT_ID,
			showOnFocus: true,
			autocomplete: function() {
				return [{
					value: 'a'
				}, {
					value: 'b'
				}, {
					value: 'c'
				}];
			}
		});

		let changed;
		input.addEventListener('change', function() {
			changed = true;
		});
		let e = new Event('keypress');
		e.which = 13;
		input.dispatchEvent(e);

		assert(changed);
	});

	it('calls autocomplete function on focus', function() {
		let called;

		let input = module({
			id: 'myinput',
			parent: utils.PARENT_ID,
			showOnFocus: true,
			autocomplete: function() {
				called = true;
				return [{
					value: 'a'
				}, {
					value: 'b'
				}, {
					value: 'c'
				}];
			}
		});

		input.dispatchEvent(new Event('focus'));
		assert(called);
	});

	it('sends change on typeahead:selected', function() {
		let input = module({
			id: 'myinput',
			parent: utils.PARENT_ID,
			showOnFocus: true,
			autocomplete: function() {
				called = true;
				return [{
					value: 'a'
				}];
			}
		});

		let called;
		input.addEventListener('change', function() {
			called = true;
		});
		$(input).trigger('typeahead:selected');
		assert(called);
	});

	it('links container visibility', function() {
		let input = module({
			id: 'myinput',
			parent: utils.PARENT_ID,
			options: ['a', 'b', 'c']
		});

		let spy = commons.linkDisplay;
		assert(spy.called);
		let args = spy.getCall(spy.callCount - 1).args;
		assert.equal(input.id, args[0].id);
		assert.equal(input.id + '-container', args[1].id);
	});

	it('adds placeholder for type=file', function() {
		module({
			id: 'myinput',
			type: 'file',
			parent: utils.PARENT_ID
		});

		assert(document.getElementById('myinput-placeholder'));
	});
});
