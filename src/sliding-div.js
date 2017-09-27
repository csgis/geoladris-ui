import commons from './commons';
import $ from 'jquery';

const ATTR_DIRECTION = 'gb-ui-sliding-direction';
const HANDLE_CLASS = 'ui-sliding-div-handle';

let bus;
let duration;

function expand(id) {
	var div = document.getElementById(id);
	var direction = div.getAttribute(ATTR_DIRECTION);
	var handle = div.parentNode.getElementsByClassName(HANDLE_CLASS)[0];

	var opts = {};
	if (direction === 'horizontal' || direction === 'both') {
		opts.width = 'show';
	}
	if (direction === 'vertical' || direction === 'both') {
		opts.height = 'show';
	}

	$(div).animate(opts, duration);
	handle.innerHTML = '-';
}

function collapse(id) {
	var div = document.getElementById(id);
	var direction = div.getAttribute(ATTR_DIRECTION);
	var handle = div.parentNode.getElementsByClassName(HANDLE_CLASS)[0];

	var opts = {};
	if (direction === 'horizontal' || direction === 'both') {
		opts.width = 'hide';
	}
	if (direction === 'vertical' || direction === 'both') {
		opts.height = 'hide';
	}

	$(div).animate(opts, duration);
	handle.innerHTML = '+';
}

function toggle(id) {
	var div = document.getElementById(id);
	var handle = div.parentNode.getElementsByClassName(HANDLE_CLASS)[0];

	if (handle.innerHTML === '+') {
		expand(id, duration);
	} else {
		collapse(id, duration);
	}
}

function init(props, injector) {
	if (bus) return; // already initalized

	bus = injector.get('bus');
	duration = props.duration || 0;

	bus.listen('ui-sliding-div:collapse', function(e, id) {
		collapse(id, duration);
	});
	bus.listen('ui-sliding-div:expand', function(e, id) {
		expand(id, duration);
	});
	bus.listen('ui-sliding-div:toggle', function(e, id) {
		toggle(id, duration);
	});
}

export default function(props, injector) {
	init(props, injector);

	var direction = props.direction || 'vertical';
	var handlePosition = props.handlePosition || 'bottom';

	// Container
	var containerId = props.id + '-container';
	var container = commons.getOrCreateElem('div', {
		id: containerId,
		parent: props.parent,
		css: 'ui-sliding-div-container'
	});

	// Handle div
	var handle = commons.getOrCreateElem('div', {
		css: HANDLE_CLASS + ' ' + handlePosition,
		html: props.visible ? '-' : '+'
	});
	handle.addEventListener('click', function() {
		toggle(props.id);
	});

	if (handlePosition === 'bottom-left' || handlePosition === 'top' || handlePosition === 'top-left' || handlePosition === 'left') {
		container.appendChild(handle);
	}

	// Content div
	var div = commons.getOrCreateElem('div', {
		id: props.id,
		parent: containerId,
		css: 'ui-sliding-div-content'
	});
	div.setAttribute(ATTR_DIRECTION, direction);

	if (!props.visible) {
		div.style.display = 'none';
	}

	if (handlePosition === 'bottom' || handlePosition === 'bottom-right' || handlePosition === 'right' || handlePosition === 'top-right') {
		container.appendChild(handle);
	}

	if (handlePosition !== 'top' && handlePosition !== 'bottom') {
		div.style.float = 'left';
	}

	return div;
}
