import commons from './commons';

export default function(props) {
	var container = commons.createContainer(props.id, props.parent, props.css);
	var input = commons.getOrCreateElem('input', {
		id: props.id,
		parent: container,
		css: (props.css || '') + ' ui-checkbox'
	});
	input.type = 'checkbox';

	commons.linkDisplay(input, container);

	var label = commons.createLabel(props.id, container, props.label);
	label.addEventListener('click', () => input.click());

	return input;
}
