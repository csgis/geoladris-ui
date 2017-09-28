import di from '@csgis/di';
import commons from './commons';

function init(options) {
	const bus = di.get('bus');
	const timeout = options.timeout || 5;

	let wrapper = commons.getOrCreateElem('div', {
		id: 'ui-alerts-wrapper',
		parent: options.parentDiv || 'center'
	});
	let container = commons.getOrCreateElem('div', {
		id: 'ui-alerts-container',
		parent: wrapper
	});

	bus.listen('ui-alert', function(e, msg) {
		let div = commons.getOrCreateElem('div', {
			parent: container,
			html: msg.message,
			css: 'ui-alert ui-alert-' + msg.severity
		});

		let close = commons.getOrCreateElem('div', {
			parent: div,
			css: 'ui-alerts-close'
		});
		close.addEventListener('click', function() {
			container.removeChild(div);
		});

		setTimeout(function() {
			container.removeChild(div);
		}, timeout * 1000);
	});
}

let load = init;
export default function(opts) {
	if (load) {
		load(opts);
		load = null;
	}
}
