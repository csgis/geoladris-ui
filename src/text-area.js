import commons from './commons';

export default function(props, injector) {
	let bus = injector.get('bus');

	var container = commons.createContainer(props.id, props.parent, props.css);
	commons.createLabel(props.id, container, props.label);
	var input = commons.getOrCreateElem('textarea', {
		id: props.id,
		parent: container,
		css: props.css + ' ui-textarea'
	});

	input.cols = props.cols;
	input.rows = props.rows;

	commons.linkDisplay(input, container);

	bus.listen(props.id + '-field-value-fill', function(e, message) {
		message[props.id] = input.value;
	});

	return input;
}
