import accordionGroup from './accordion-group';
import buttons from './buttons';
import checkbox from './checkbox';
import choice from './choice';
import commons from './commons';
import confirmDialog from './confirm-dialog';
import dialog from './dialog';
import divstack from './divstack';
import dropdownButtons from './dropdown-buttons';
import input from './input';
import radio from './radio';
import slider from './slider';
import slidingDiv from './sliding-div';
import textArea from './text-area';
import Tooltip from 'tooltip.js';
import Sortable from 'sortablejs';
import di from '@csgis/di';

export default function () {
  const bus = di.get('bus');

  bus.listen('ui-show', function (e, id) {
    document.getElementById(id).style.display = '';
  });

  bus.listen('ui-hide', function (e, id) {
    document.getElementById(id).style.display = 'none';
  });

  bus.listen('ui-toggle', function (event, id) {
    let e = document.getElementById(id);
    e.style.display = e.style.display === 'none' ? '' : 'none';
  });

  bus.listen('ui-open-url', function (e, msg) {
    window.open(msg.url, msg.target);
  });

  bus.listen('modules-loaded', function () {
    bus.send('ui-loaded');
  });

  return {
    create: function (type, props) {
			// Do not create if already exists
      let e = document.getElementById(props.id);
      if (e) {
        return e;
      }

      switch (type) {
      case 'accordion-group':
        e = accordionGroup(props);
        break;
      case 'autocomplete':
        e = input(props);
        break;
      case 'button':
        e = buttons(props);
        break;
      case 'checkbox':
        e = checkbox(props);
        break;
      case 'choice':
        e = choice(props);
        break;
      case 'confirm-dialog':
        e = confirmDialog(props);
        break;
      case 'dialog':
        e = dialog(props);
        break;
      case 'divstack':
        e = divstack(props);
        break;
      case 'dropdown-button':
        e = dropdownButtons(props);
        break;
      case 'input':
        e = input(props);
        break;
      case 'radio':
        e = radio(props);
        break;
      case 'slider':
        e = slider(props);
        break;
      case 'sliding-div':
        e = slidingDiv(props);
        break;
      case 'text-area':
        e = textArea(props);
        break;
      default:
        e = commons.getOrCreateElem(type, props);
        break;
      }

      if (e) {
        bus.send('ui:created', e);
      }
      return e;
    },
    tooltip: function (elem, props) {
      let e = (typeof elem === 'string') ? document.getElementById(elem) : elem;
      let tooltip = new Tooltip(e, {
        placement: props.location,
        html: true,
        title: props.text
      });
      tooltip.show();
      return tooltip._tooltipNode;
    },
    sortable: function (elem) {
      let e = (typeof elem === 'string') ? document.getElementById(elem) : elem;

      Sortable.create(e, {
        onSort: function (event) {
          elem.dispatchEvent(new CustomEvent('change', {
            detail: {
              item: event.item,
              newIndex: event.newIndex,
              oldIndex: event.oldIndex
            }
          }));
        }
      });
    }
  };
}
