import $ from 'jquery';
import commons from './commons';
import Pikaday from 'pikaday';
import di from '@csgis/di';
import typeahead from 'typeahead.js';

class Input {
	constructor(opts) {
		this.createUI(opts);
		this.wire(opts);
	}

	createUI(opts) {
		let container = commons.createContainer(opts.id, opts.parent, opts.css);
		commons.createLabel(opts.id, container, opts.label);
		this.input = commons.getOrCreateElem('input', {
			id: opts.id,
			parent: container,
			css: (opts.css || '') + ' ui-choice'
		});

		commons.linkDisplay(this.input, container);

		this.input.type = opts.type || 'text';
		if (opts.placeholder) {
			this.input.placeholder = opts.placeholder;
		}

		if (opts.type === 'number') {
			this.input.step = 'any';
		} else if (opts.type === 'date') {
			new Pikaday({
				field: this.input,
				format: 'YYYY-MM-DD'
			});
			this.input.type = 'text';
			this.input.setAttribute('geoladris-type', 'date');
		} else if (opts.type === 'file') {
			this.placeholder = commons.getOrCreateElem('div', {
				id: opts.id + '-placeholder',
				parent: container,
				css: (opts.css || '') + ' ui-file-input-placeholder'
			});
		}

		if (opts.autocomplete && this.input.type === 'text') {
			opts.minQueryLength = opts.minQueryLength || 0;
			$(this.input).typeahead({
				highlight: true,
				minLength: opts.minQueryLength,
				autoselect: true
			}, {
				minLength: opts.minQueryLength,
				source: function(q, cb) {
					cb(opts.autocomplete(q));
				},
				templates: {
					suggestion: function(data) {
						return "<p class='" + (data.type || '') + "'>" + data.value + '</p>';
					}
				}
			});
		}
	}

	wire(opts) {
		let bus = di.get('bus');
		let id = this.input.id;
		bus.listen(id + '-field-value-fill', function(e, message) {
			let input = document.getElementById(id);
			if (input.type === 'file') {
				message[id] = input.files[0];
			} else if (input.type === 'number') {
				message[id] = parseFloat(input.value);
			} else if (input.getAttribute('geoladris-type') === 'date') {
				message[id] = new Date(input.value).toISOString();
			} else {
				message[id] = input.value;
			}
		});

		this.input.addEventListener('input', function() {
			let input = document.getElementById(id);
			let valid = !!Date.parse(input.value);
			if (input.getAttribute('geoladris-type') === 'date') {
				input.setCustomValidity(valid ? '' : 'Invalid date.');
			} else if (input.type === 'file') {
				this.placeholder.innerHTML = input.files[0].name;
			}
		});

		if (opts.autocomplete && this.input.type === 'text') {
			if (opts.showOnFocus) {
				// Show dropdown on input focus
				this.input.addEventListener('focus', function() {
					let input = document.getElementById(id);
					if (input.value.length >= opts.minQueryLength) {
						// This is a bit obscure, but the only way I found to do it
						let query = (input.value || '').replace(/^\s*/g, '').replace(/\s{2,}/g, ' ');
						let data = $(input).data('ttTypeahead');
						data.dropdown.update(query);
						data.dropdown.open();
					}
				});
			}

			this.input.addEventListener('keypress', function(event) {
				if (event.which === 13) {
					let input = document.getElementById(id);
					input.dispatchEvent(new Event('change'));
				}
			});

			$(this.input).on('typeahead:selected', function() {
				document.getElementById(id).dispatchEvent(new Event('change'));
			});
		}
	}
}

export default (opts) => new Input(opts).input;
