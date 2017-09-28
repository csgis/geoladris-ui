import di from '@csgis/di';
import commons from './commons';

class Checkbox {
	constructor(opts) {
		const bus = di.get('bus');

		let container = commons.createContainer(opts.id, opts.parent, opts.css);
		this.input = commons.getOrCreateElem('input', {
			id: opts.id,
			parent: container,
			css: (opts.css || '') + ' ui-checkbox'
		});
		this.input.type = 'checkbox';

		let label = commons.createLabel(opts.id, container, opts.label, bus);
		commons.linkDisplay(this.input, container);
		label.addEventListener('click', () => this.input.click());
	}
}

export default (opts) => new Checkbox(opts).input;
