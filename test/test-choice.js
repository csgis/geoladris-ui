import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import commons from '../src/commons';
import choice from '../src/choice';

describe('choice', function() {
	di.bind('bus', bus);
	commons.linkDisplay = sinon.spy(commons, 'linkDisplay');
	beforeEach(utils.replaceParent);

	it('creates div on create', function() {
		choice({
			id: 'mychoice',
			parent: utils.PARENT_ID
		}, di);

		let parent = document.getElementById(utils.PARENT_ID);
		assert.equal(1, parent.children.length);
		assert.equal(1, parent.querySelectorAll('#mychoice').length);
	});

	it('creates label on create', function() {
		let text = 'Choice: ';
		choice({
			id: 'mychoice',
			parent: utils.PARENT_ID,
			label: text
		}, di);

		let parent = document.getElementById(utils.PARENT_ID);
		let label = parent.querySelectorAll('label');
		assert.equal(1, label.length);
		assert.equal(text, label[0].innerHTML);
	});

	it('adds values if specified on create', function() {
		let c = choice({
			id: 'mychoice',
			parent: utils.PARENT_ID,
			values: ['One', 'Two', 'Three']
		}, di);

		assert(c);
		assert.equal(3, c.children.length);
	});

	it('fills message on -field-value-fill', function() {
		choice({
			id: 'mychoice',
			parent: utils.PARENT_ID,
			values: ['One', 'Two', 'Three']
		}, di);

		let message = {};
		bus.send('mychoice-field-value-fill', message);
		assert.equal('One', message.mychoice);
	});

	it('sets values on set-values', function() {
		let c = choice({
			id: 'mychoice',
			parent: utils.PARENT_ID,
			values: ['One', 'Two', 'Three']
		}, di);

		bus.send('ui-choice-field:mychoice:set-values', [
			[{
				value: '1',
				text: ' One '
			}, {
				value: '2',
				text: ' Two '
			}]
		]);

		assert.equal('1', c.options[0].value);
		assert.equal(' One ', c.options[0].innerHTML);
		assert.equal('2', c.options[1].value);
		assert.equal(' Two ', c.options[1].innerHTML);
	});

	it('links container visibility', function() {
		let c = choice({
			id: 'mychoice',
			parent: utils.PARENT_ID,
			values: ['One', 'Two', 'Three']
		}, di);

		let spy = commons.linkDisplay;
		assert(spy.called);
		let args = spy.getCall(spy.callCount - 1).args;
		assert.equal(c.id, args[0].id);
		assert.equal(c.id + '-container', args[1].id);
	});
});
