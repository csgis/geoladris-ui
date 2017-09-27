import commons from './commons';

export default function(props, injector) {
	let bus = injector.get('bus');
	var container = commons.createContainer(props.id, props.parent, props.css);
	commons.createLabel(props.id, container, props.label);
	var input = commons.getOrCreateElem('select', {
		id: props.id,
		parent: container,
		css: (props.css || '') + ' ui-choice'
	});

	commons.linkDisplay(input, container);

	function addValues(values) {
		if (!values) {
			return;
		}

		values.forEach(function(v) {
			var option = commons.getOrCreateElem('option', {
				parent: input,
				html: typeof v === 'string' ? v : v.text
			});
			option.value = typeof v === 'string' ? v : v.value;
		});
	}

	addValues(props.values);

	bus.listen('ui-choice-field:' + props.id + ':set-values', function(e, values) {
		input.innerHTML = '';
		addValues(values);
	});

	bus.listen(props.id + '-field-value-fill', function(e, message) {
		message[props.id] = input.options[input.selectedIndex].value;
	});

	return input;
}
