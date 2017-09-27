import commons from './commons';
import uiSliding from './sliding-div';
import uiButtons from './buttons';

export default function(props, injector) {
	let bus = injector.get('bus');

	// Map id -> image
	var buttons = {};

	var id = props.id;

	var container = commons.getOrCreateElem('div', {
		id: id + '-container',
		parent: props.parent,
		css: 'ui-dropdown-button-container'
	});

	props.css = (props.css || '') + ' ui-dropdown-button-button';
	props.parent = id + '-container';
	var button = uiButtons(props, injector);

	var sliding = uiSliding({
		id: id + '-sliding',
		parent: id + '-container'
	}, injector);

	function setImage(image) {
		var iconDiv = button.getElementsByClassName('button-content')[0];
		iconDiv.style['background-image'] = 'url(' + image + ')';
	}

	var selected;
	bus.listen('ui-dropdown-button:' + id + ':add-item', function(e, msg) {
		buttons[msg.id] = msg.image;

		var item = commons.getOrCreateElem('div', {
			id: id + '-' + msg.id,
			parent: sliding,
			css: 'ui-dropdown-button-item'
		});
		item.style['background-image'] = "url('" + msg.image + "')";
		item.title = msg.tooltip;

		item.addEventListener('click', function() {
			if (msg.id !== selected) {
				selected = msg.id;
				bus.send('ui-sliding-div:collapse', sliding.id);
				setImage(msg.image);
				bus.send('ui-dropdown-button:' + id + ':item-selected', msg.id);
			} else {
				bus.send('ui-sliding-div:collapse', sliding.id);
			}
		});
	});

	if (props.dropdownOnClick) {
		button.addEventListener('click', function() {
			bus.send('ui-sliding-div:toggle', sliding.id);
		});
	}

	bus.listen('ui-dropdown-button:' + id + ':set-item', function(e, itemId) {
		selected = itemId;
		setImage(buttons[itemId]);
	});

	return container;
}
