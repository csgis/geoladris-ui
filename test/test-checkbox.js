import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import commons from '../src/commons';
import module from '../src/checkbox';

describe('checkbox', function() {
	di.bind('bus', bus);
	commons.linkDisplay = sinon.spy(commons, 'linkDisplay');
	beforeEach(utils.replaceParent);

	it('adds a checkbox', function() {
		let input = module({
			id: 'myitem',
			parent: utils.PARENT_ID,
			text: 'Item 1'
		}, di);

		assert(input);
		assert.equal('checkbox', input.type);

		let container = document.getElementById(utils.PARENT_ID).querySelector('.ui-input-container');
		assert.equal(1, container.getElementsByClassName('ui-checkbox').length);
		assert.equal(1, container.getElementsByClassName('ui-label').length);
	});

	it('triggers input click on checkbox text clicked', function() {
		let input = module({
			id: 'myitem',
			parent: utils.PARENT_ID,
			text: 'Item 1'
		}, di);

		let clicked;
		input.addEventListener('click', function() {
			clicked = true;
		});

		document.getElementById(utils.PARENT_ID).querySelector('.ui-label').click();
		assert(clicked);
	});

	it('links container visibility', function() {
		let input = module({
			id: 'myitem',
			parent: utils.PARENT_ID,
			text: 'Item 1'
		}, di);

		let spy = commons.linkDisplay;
		assert(spy.called);
		let args = spy.getCall(spy.callCount - 1).args;
		assert.equal(input.id, args[0].id);
		assert.equal(input.id + '-container', args[1].id);
	});
});
