import di from '@csgis/di';
import commons from './commons';

class Choice {
	constructor(opts) {
		this.createUI(opts);
		this.wire();
	}

	createUI(opts) {
		var container = commons.createContainer(opts.id, opts.parent, opts.css);
		commons.createLabel(opts.id, container, opts.label);
		this.input = commons.getOrCreateElem('select', {
			id: opts.id,
			parent: container,
			css: (opts.css || '') + ' ui-choice'
		});

		commons.linkDisplay(this.input, container);

		this.addValues(opts.values);
	}

	wire() {
		const bus = di.get('bus');

		let id = this.input.id;
		bus.listen('ui-choice-field:' + id + ':set-values', (e, values) => {
			document.getElementById(id).innerHTML = '';
			this.addValues(values);
		});

		bus.listen(id + '-field-value-fill', (e, message) => {
			let input = document.getElementById(id);
			message[id] = input.options[input.selectedIndex].value;
		});
	}

	addValues(values) {
		if (!values) return;

		values.forEach(v => {
			let option = commons.getOrCreateElem('option', {
				parent: this.input,
				html: typeof v === 'string' ? v : v.text
			});
			option.value = typeof v === 'string' ? v : v.value;
		});
	}
}

export default (opts) => new Choice(opts).input;
