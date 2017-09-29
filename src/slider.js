import di from '@csgis/di';
import commons from './commons';
import noUiSlider from 'nouislider';

class Slider {
  constructor(opts) {
    this.snap = opts.snap;
    this.pips = opts.pips;

    this.createUI(opts);
    this.wire(opts);
  }

  createUI(opts) {
    let container = commons.createContainer(opts.id, opts.parent, opts.css);
    commons.createLabel(opts.id, container, opts.label);
    this.slider = commons.getOrCreateElem('div', {
      id: opts.id,
      parent: container,
      css: 'ui-slider-input ' + (opts.css || '')
    });

    commons.linkDisplay(this.slider, container);

    this.addValues(opts.values);
    if (opts.value) {
      this.slider.noUiSlider.set(this.useDates ? opts.value.getTime() : opts.value);
    }
  }

  wire(opts) {
    let bus = di.get('bus');
    let that = this;

    if (opts.id) {
      bus.listen('ui-slider:' + opts.id + ':set-values', (e, values) => {
        let slider = document.getElementById(that.slider.id);
        slider.innerHTML = '';
        that.addValues(values);
      });

      bus.listen('ui-slider:' + opts.id + ':set-value', (e, value) => {
        let slider = document.getElementById(that.slider.id);
        slider.noUiSlider.set(value);
      });

      bus.listen(opts.id + '-field-value-fill', (e, message) => {
        let slider = document.getElementById(that.slider.id);
        message[opts.id] = parseFloat(slider.noUiSlider.get());
      });
    }
  }

  parseValue(v) {
    let val = parseFloat(v);
    return this.useDates ? new Date(val) : val;
  }

  dispatch(name) {
    this.slider.dispatchEvent(new CustomEvent(name, {
      detail: {
        value: this.parseValue(this.slider.noUiSlider.get())
      }
    }));
  }

  addValues(v) {
    let values = v;
    if (!values || values.constructor !== Array || !values.length) {
      return;
    }

    if (values[0] instanceof Date) {
      this.useDates = true;
      values = values.map(function (date) {
        return date.getTime();
      });
    }

    values.sort(function (a, b) {
      return a - b;
    });

    let range = {
      'min': values[0],
      'max': values[values.length - 1]
    };

    let unitPerc = 100.0 / (range.max - range.min);
    for (let i = 1; i < values.length - 1; i++) {
      let value = values[i];
      let perc = unitPerc * (value - range.min);
      range[perc + '%'] = value;
    }

    if (this.slider.noUiSlider) {
      this.slider.noUiSlider.updateOptions({
        start: values[0],
        range: range
      });
    } else {
      let options = {
        animate: false,
        start: values[0],
        range: range,
        snap: this.snap
      };

      if (this.pips === true || this.pips instanceof Function) {
        options.pips = {
          mode: 'steps',
          density: 100
        };
      }
      noUiSlider.create(this.slider, options);
    }

    this.slider.noUiSlider.on('change', () => this.dispatch('change'));
    this.slider.noUiSlider.on('slide', () => this.dispatch('slide'));

    if (this.pips instanceof Function) {
      let nodes = this.slider.querySelectorAll('.noUi-value.noUi-value-horizontal.noUi-value-large');
      Array.prototype.forEach.call(nodes, (el) => {
        el.innerHTML = this.pips(this.parseValue(el.innerHTML));
      });
    }
  }
}

export default (opts) => new Slider(opts).slider;
