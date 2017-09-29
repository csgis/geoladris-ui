import commons from './commons';
import di from '@csgis/di';
import uiSliding from './sliding-div';
import uiButtons from './buttons';

class DropdownButton {
  constructor(opts) {
    this.buttons = {};
    this.createUI(opts);
    this.wire(opts);
  }

  createUI(opts) {
    this.container = commons.getOrCreateElem('div', {
      id: opts.id + '-container',
      parent: opts.parent,
      css: 'ui-dropdown-button-container'
    });

    opts.css = (opts.css || '') + ' ui-dropdown-button-button';
    opts.parent = opts.id + '-container';
    this.button = uiButtons(opts);
    this.sliding = uiSliding({
      id: opts.id + '-sliding',
      parent: opts.id + '-container'
    });
  }

  wire(opts) {
    let bus = di.get('bus');
    let id = opts.id;
    let slidingId = this.sliding.id;

    let that = this;

    bus.listen('ui-dropdown-button:' + id + ':add-item', function (e, msg) {
      that.buttons[msg.id] = msg.image;

      let item = commons.getOrCreateElem('div', {
        id: id + '-' + msg.id,
        parent: that.sliding,
        css: 'ui-dropdown-button-item'
      });
      item.style['background-image'] = "url('" + msg.image + "')";
      item.title = msg.tooltip;

      item.addEventListener('click', () => {
        if (msg.id !== that.selected) {
          that.selected = msg.id;
          bus.send('ui-sliding-div:collapse', slidingId);
          that.setImage(msg.image);
          bus.send('ui-dropdown-button:' + id + ':item-selected', msg.id);
        } else {
          bus.send('ui-sliding-div:collapse', slidingId);
        }
      });
    });

    if (opts.dropdownOnClick) {
      this.button.addEventListener('click', () => bus.send('ui-sliding-div:toggle', slidingId));
    }

    bus.listen('ui-dropdown-button:' + id + ':set-item', function (e, itemId) {
      that.selected = itemId;
      that.setImage(that.buttons[itemId]);
    });
  }

  setImage(image) {
    let iconDiv = this.button.getElementsByClassName('button-content')[0];
    iconDiv.style['background-image'] = 'url(' + image + ')';
  }
}

export default (props) => new DropdownButton(props).container;
