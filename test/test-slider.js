import assert from 'assert';
import sinon from 'sinon';
import * as utils from './utils';

import bus from '@geoladris/event-bus';
import di from '@csgis/di';

import commons from '../src/commons';
import module from '../src/slider';

describe('slider', function () {
  di.bind('bus', bus);
  commons.linkDisplay = sinon.spy(commons, 'linkDisplay');
  beforeEach(utils.replaceParent);

  it('creates div on create', function () {
    module({
      id: 'myslider',
      parent: utils.PARENT_ID,
      label: 'Slider: '
    });

    var parent = document.getElementById(utils.PARENT_ID);
    assert.equal(1, parent.children.length);
    var container = parent.children[0];
    assert.equal(2, container.children.length);
    var label = container.querySelectorAll('label');
    assert.equal(1, label.length);
    assert.equal('Slider: ', label[0].textContent);
    var slider = document.getElementById('myslider');
    assert(slider);
    assert.equal(container, slider.parentNode);
  });

  it('hides label if no text on create', function () {
    module({
      id: 'myslider',
      parent: utils.PARENT_ID
    });

    var label = document.getElementById(utils.PARENT_ID).querySelectorAll('label');
    assert.equal(1, label.length);
    assert.equal('none', label[0].style.display);
  });

  it('adds values if specified on create', function () {
    var slider = module({
      id: 'myslider',
      parent: utils.PARENT_ID,
      values: [1, 4, 5]
    });

    assert.deepEqual({
      'min': 1,
      'max': 5,
      '75%': 4
    }, slider.noUiSlider.options.range);
  });

  it('fills message on -field-value-fill', function () {
    module({
      id: 'myslider',
      parent: utils.PARENT_ID,
      values: [1, 4, 5]
    });

    var message = {};
    bus.send('myslider-field-value-fill', message);
    assert.equal(1, message.myslider);
  });

  it('sets values on set-values', function () {
    var slider = module({
      id: 'myslider',
      parent: utils.PARENT_ID,
      values: [1, 4, 5]
    });

    bus.send('ui-slider:myslider:set-values', [
      [1, 2]
    ]);
    assert.deepEqual({
      'min': 1,
      'max': 2
    }, slider.noUiSlider.options.range);
  });

  it('sets value on set-value', function () {
    var slider = module({
      id: 'myslider',
      parent: utils.PARENT_ID,
      values: [1, 2, 5]
    });

    assert.equal(1, parseInt(slider.noUiSlider.get()));
    bus.send('ui-slider:myslider:set-value', 2);
    assert.equal(2, parseInt(slider.noUiSlider.get()));
  });

  it('sets value on creation if specified', function () {
    var slider = module({
      id: 'myslider',
      parent: utils.PARENT_ID,
      values: [1, 2, 5],
      value: 2
    });

    assert.equal(2, parseInt(slider.noUiSlider.get()));
  });

  it('uses snap if specified', function () {
    var slider = module({
      id: 'myslider',
      parent: utils.PARENT_ID,
      values: [1, 2, 5],
      snap: true
    });

    assert(slider.noUiSlider.options.snap);
  });

  it('does not use snap by default', function () {
    var slider = module({
      id: 'myslider',
      parent: utils.PARENT_ID,
      values: [1, 2, 5]
    });

    assert(!slider.noUiSlider.options.snap);
  });

  it('links container visibility', function () {
    var slider = module({
      id: 'myslider',
      parent: utils.PARENT_ID,
      values: [1, 2, 5]
    });

    let spy = commons.linkDisplay;
    assert(spy.called);
    var args = spy.getCall(spy.callCount - 1).args;
    assert.equal(slider.id, args[0].id);
    assert.equal(slider.id + '-container', args[1].id);
  });

  it('supports date values', function (done) {
    var date1 = new Date('2017-01-25T00:00:00Z');
    var date2 = new Date('2017-03-02T00:00:00Z');
    var slider = module({
      id: 'myslider',
      parent: utils.PARENT_ID,
      values: [date1, date2],
      value: date1
    });

    slider.addEventListener('slide', function (e) {
      assert.deepEqual(date2, e.detail.value);
      done();
    });

    slider.noUiSlider.__moveHandles(true, 100, [0]);
  });

  it('supports custom pips', function () {
    var slider = module({
      id: 'myslider',
      parent: utils.PARENT_ID,
      values: [0, 1, 2],
      value: 0,
      pips: function (value) {
        return 'Value is: ' + value;
      }
    });

    var e = slider.querySelector('.noUi-value.noUi-value-horizontal.noUi-value-large');
    assert.equal('Value is: 0', e.innerHTML);
  });
});
