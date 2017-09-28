import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import module from '../src/form-collector';
import choice from '../src/choice';
import buttons from '../src/buttons';
import input from '../src/input';

const BUTTON_ID = 'mybutton';

describe('form-collector', function() {
	di.bind('bus', bus);

	afterEach(function() {
		bus.send.restore();
	});

	beforeEach(function() {
		bus.stopListenAll();
		module();
		bus.send = sinon.spy(bus, 'send');
		utils.replaceParent();
		choice({
			id: 'letters',
			parent: utils.PARENT_ID,
			values: ['A', 'B', 'C']
		});
		choice({
			id: 'numbers',
			parent: utils.PARENT_ID,
			values: ['1', '2', '3']
		});
		input({
			id: 'freetext',
			parent: utils.PARENT_ID
		});
		input({
			id: 'mydate',
			parent: utils.PARENT_ID,
			type: 'date'
		});
		buttons({
			id: BUTTON_ID,
			parent: utils.PARENT_ID
		});
	});

	it('sends event on button click', function() {
		bus.send('ui-form-collector:extend', {
			button: BUTTON_ID,
			divs: ['letters', 'numbers'],
			clickEventName: 'myevent'
		});
		document.getElementById(BUTTON_ID).click();

		assert(bus.send.calledWith('myevent', {
			letters: 'A',
			numbers: '1'
		}));
	});

	it('does not send event on button click if button is disabled', function() {
		bus.send('ui-form-collector:extend', {
			button: BUTTON_ID,
			divs: ['letters', 'numbers'],
			clickEventName: 'myevent'
		});

		bus.send('ui-button:' + BUTTON_ID + ':enable', false);
		document.getElementById(BUTTON_ID).click();

		assert(!bus.send.calledWith('myevent', {
			letters: 'A',
			numbers: '1'
		}));
	});

	it('translates event message if names specified', function() {
		bus.send('ui-form-collector:extend', {
			button: BUTTON_ID,
			divs: ['letters', 'numbers'],
			names: ['l', 'n'],
			clickEventName: 'myevent'
		});
		document.getElementById(BUTTON_ID).click();

		assert(bus.send.calledWith('myevent', {
			l: 'A',
			n: '1'
		}));
	});

	it('disables button if any of the requiredDivs have no value', function() {
		bus.send('ui-form-collector:extend', {
			button: BUTTON_ID,
			divs: ['letters', 'numbers', 'freetext'],
			requiredDivs: ['freetext'],
			names: ['l', 'n', 'f'],
			clickEventName: 'myevent'
		});

		let i = document.getElementById('freetext');
		i.value = '';
		i.dispatchEvent(new Event('input'));
		assert(bus.send.calledWith('ui-button:' + BUTTON_ID + ':enable', false));
	});

	it('enables button if all the requiredDivs have a not empty value', function() {
		bus.send('ui-form-collector:extend', {
			button: BUTTON_ID,
			divs: ['letters', 'numbers', 'freetext'],
			requiredDivs: ['freetext'],
			names: ['l', 'n', 'f'],
			clickEventName: 'myevent'
		});

		assert(!bus.send.calledWith('ui-button:' + BUTTON_ID + ':enable', true));
		let i = document.getElementById('freetext');
		i.value = 'not empty';
		i.dispatchEvent(new Event('input'));
		assert(bus.send.calledWith('ui-button:' + BUTTON_ID + ':enable', true));
	});

	it('enables button depending on dates being parseable or not', function() {
		bus.send('ui-form-collector:extend', {
			button: BUTTON_ID,
			divs: ['letters', 'numbers', 'freetext', 'mydate'],
			requiredDivs: [],
			names: ['l', 'n', 'f', 'd'],
			clickEventName: 'myevent'
		});

		let i = document.getElementById('mydate');
		i.value = 'invalid_date';
		i.dispatchEvent(new Event('input'));
		assert(!bus.send.calledWith('ui-button:' + BUTTON_ID + ':enable', true));
		i.value = '2015-10-30';
		i.dispatchEvent(new Event('input'));
		assert(bus.send.calledWith('ui-button:' + BUTTON_ID + ':enable', true));
	});
});
