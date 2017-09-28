import commons from './commons';
import di from '@csgis/di';

let zIndex;

class Dialog {
	constructor(opts) {
		const bus = di.get('bus');

		this.createUI(opts);
		this.wire(opts, bus);

		if (opts.visible) {
			bus.send('ui-show', opts.id);
		} else {
			bus.send('ui-hide', opts.id);
		}
	}

	createUI(opts) {
		this.container = commons.getOrCreateElem('div', {
			id: opts.id + '-dialog-container',
			parent: opts.parent,
			css: 'dialog-container'
		});

		if (opts.modal) {
			this.container.classList.add('dialog-modal');
		}

		this.elem = commons.getOrCreateElem('div', {
			id: opts.id,
			parent: this.container,
			css: 'dialog ' + (opts.css || '')
		});

		this.title = commons.getOrCreateElem('div', {
			parent: this.elem,
			css: 'dialog-title',
			html: opts.title
		});

		if (opts.closeButton) {
			this.close = commons.getOrCreateElem('div', {
				parent: this.elem,
				css: 'dialog-close'
			});
		}
	}

	wire(opts, bus) {
		let elemId = this.elem.id;
		bus.listen('ui-show', (e, id) => {
			if (id === elemId) {
				this.showOnTop();
			}
		});
		bus.listen('ui-hide', (e, id) => {
			if (id === opts.id) {
				this.container.style.display = 'none';
			}
		});
		bus.listen('ui-toggle', (e, id) => {
			if (id === opts.id) {
				if (this.container.style.display === 'none') {
					this.showOnTop();
				} else {
					this.container.style.display = 'none';
				}
			}
		});

		let dragging = false;
		let startX;
		let startY;
		let startOffsetTop;
		let startOffsetLeft;

		this.title.addEventListener('mousedown', (event) => {
			this.title.style.cursor = 'move';
			dragging = true;
			startX = event.clientX;
			startY = event.clientY;
			startOffsetTop = this.elem.offsetTop;
			startOffsetLeft = this.elem.offsetLeft;
		});

		this.title.addEventListener('mouseup', () => {
			dragging = false;
			this.title.style.cursor = 'originalCursor';
		});

		window.addEventListener('mousemove', (event) => {
			if (!dragging) {
				return;
			}

			this.elem.style.position = 'fixed';
			this.elem.style.top = startOffsetTop + (event.clientY - startY) + 'px';
			this.elem.style.left = startOffsetLeft + (event.clientX - startX) + 'px';
			this.elem.style.right = 'unset';
			this.elem.style.bottom = 'unset';
		});


		if (opts.closeButton) {
			this.close.addEventListener('click', () => bus.send('ui-hide', elemId));
		}
	}

	showOnTop() {
		this.container.style.display = '';
		let i = parseInt(this.container.style.zIndex);
		if (!zIndex) {
			zIndex = i + 1;
		} else {
			this.container.style.zIndex = zIndex++;
		}
	}
}

export default (props) => new Dialog(props).elem;
