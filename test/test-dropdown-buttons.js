import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';
import $ from 'jquery';

import module from '../src/dropdown-buttons';
import commons from '../src/commons';

describe('dropdown-buttons', function() {
	di.bind('bus', bus);
	bus.send = sinon.spy(bus, 'send');
	commons.linkDisplay = sinon.spy(commons, 'linkDisplay');
	beforeEach(utils.replaceParent);

	it('adds a div on add-item', function() {
		module({
			id: 'mybutton',
			parent: utils.PARENT_ID
		});

		assert.equal(0, $('#mybutton-sliding').children().length);
		bus.send('ui-dropdown-button:mybutton:add-item', {
			id: 'myitem',
			image: 'css/images/image.svg'
		});
		assert.equal(1, $('#mybutton-sliding').children().length);
		let bg = $('#mybutton-sliding').children().css('background-image');
		assert.notEqual(-1, bg.indexOf('css/images/image.svg'));
	});

	it('toggles the sliding on click if dropdownOnClick', function() {
		module({
			id: 'mybutton',
			parent: utils.PARENT_ID,
			dropdownOnClick: true
		});

		assert(!bus.send.calledWith('ui-sliding-div:toggle', 'mybutton-sliding'));
		$('#mybutton').click();
		assert(bus.send.calledWith('ui-sliding-div:toggle', 'mybutton-sliding'));
	});

	it('sends item-selected on item click', function() {
		mockWithItem();
		$('#mybutton-sliding').children().click();
		assert(bus.send.calledWith('ui-dropdown-button:mybutton:item-selected', 'myitem'));
	});

	it('collapses sliding div on item click', function() {
		mockWithItem();
		$('#mybutton-sliding').children().click();
		assert(bus.send.calledWith('ui-sliding-div:collapse', 'mybutton-sliding'));
	});

	it('changes the button background on item click', function() {
		mockWithItem();
		$('#mybutton-sliding').children(':eq(1)').click();
		let button = document.getElementById('mybutton');
		let iconDiv = $(button).children('.button-content');
		assert(iconDiv.css('background-image').match('css/images/icon2.png'));
	});

	it('changes the button background on set-item', function() {
		mockWithItem();
		bus.send('ui-dropdown-button:mybutton:set-item', 'myitem2');
		let button = document.getElementById('mybutton');
		let iconDiv = $(button).children('.button-content');
		assert(iconDiv.css('background-image').match('css/images/icon2.png'));
	});

	it('sets title attribute if tooltip provided on add-item', function() {
		let tooltip = 'My item tooltip';
		module({
			id: 'mybutton',
			parent: utils.PARENT_ID,
			dropdownOnClick: true
		});
		bus.send('ui-dropdown-button:mybutton:add-item', {
			id: 'myitem',
			image: 'css/images/icon.png',
			tooltip: tooltip
		});

		let item = $('#mybutton-sliding').children();
		assert.equal(tooltip, item.attr('title'));
	});

	function mockWithItem() {
		module({
			id: 'mybutton',
			parent: utils.PARENT_ID,
			dropdownOnClick: true
		});
		bus.send('ui-dropdown-button:mybutton:add-item', {
			id: 'myitem',
			image: 'css/images/img.svg'
		});
		bus.send('ui-dropdown-button:mybutton:add-item', {
			id: 'myitem2',
			image: 'css/images/icon2.png'
		});
	}
});
