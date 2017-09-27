import commons from './commons';

let bus;
let timeout = 5;

export default function(options, injector) {
	if (bus) return; // already initialized

	bus = injector.get('bus');

	if (options.timeout) timeout = options.timeout;

	var wrapper = commons.getOrCreateElem('div', {
		id: 'ui-alerts-wrapper',
		parent: options.parentDiv || 'center'
	});
	var container = commons.getOrCreateElem('div', {
		id: 'ui-alerts-container',
		parent: wrapper
	});

	bus.listen('ui-alert', function(e, msg) {
		var div = commons.getOrCreateElem('div', {
			parent: container,
			html: msg.message,
			css: 'ui-alert ui-alert-' + msg.severity
		});

		var close = commons.getOrCreateElem('div', {
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
