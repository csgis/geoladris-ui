import commons from './commons';
import dialogs from './dialogs';
import buttons from './buttons';

export default function(props, injector) {
	let bus = injector.get('bus');
	props.modal = true;
	props.css = (props.css || '') + ' ui-confirm-dialog';
	if (!props.messages) {
		props.messages = {};
	}

	var dialog = dialogs(props, injector);

	if (props.messages.question) {
		commons.getOrCreateElem('div', {
			id: props.id + '-message',
			parent: props.id,
			css: 'ui-confirm-dialog-message',
			html: props.messages.question
		});
	}

	var buttonsContainer = props.id + '-confirm-buttons-container';
	commons.getOrCreateElem('div', {
		id: buttonsContainer,
		parent: props.id,
		css: 'ui-confirm-dialog-buttons-container'
	});
	buttons({
		id: props.id + '-ok',
		parent: buttonsContainer,
		css: 'dialog-ok-button ui-confirm-dialog-ok',
		text: props.messages.ok,
		clickEventName: 'ui-confirm-dialog:' + props.id + ':ok'
	});
	buttons({
		id: props.id + '-cancel',
		parent: buttonsContainer,
		css: 'dialog-ok-button ui-confirm-dialog-cancel',
		text: props.messages.cancel,
		clickEventName: 'ui-confirm-dialog:' + props.id + ':cancel'
	});

	bus.listen('ui-confirm-dialog:' + props.id + ':cancel', function() {
		bus.send('ui-hide', props.id);
	});

	bus.listen('ui-confirm-dialog:' + props.id + ':ok', function() {
		bus.send('ui-hide', props.id);
	});

	return dialog;
}
