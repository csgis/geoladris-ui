import di from '@csgis/di';

export default function () {
  let bus = di.get('bus');

  bus.listen('ui-form-collector:extend', function (e, msg) {
    function updateButton() {
      let enabled = true;
      msg.requiredDivs.forEach(function (id) {
        let input = document.getElementById(id);
        let tag = input.tagName.toLowerCase();
        if (tag === 'input' && input.type === 'file') {
          let parent = input.parentNode;
          let placeholder = parent.getElementsByClassName('ui-file-input-placeholder')[0];
          enabled = enabled && !!placeholder.innerHTML;
        } else {
          enabled = enabled && !!input.value;
        }
      });

      if (enabled) {
        msg.divs.forEach(function (id) {
          let input = document.getElementById(id);
          if (input && input.getAttribute('geoladris-type') === 'date') {
            enabled = enabled && !!Date.parse(input.value);
          }
        });
      }

      bus.send('ui-button:' + msg.button + ':enable', enabled);
    }

    msg.divs.forEach(function (id) {
      let input = document.getElementById(id);
      if (input && input.getAttribute('geoladris-type') === 'date') {
        input.addEventListener('input', updateButton);
      }
    });

    if (msg.requiredDivs) {
      msg.requiredDivs.forEach(function (id) {
        let input = document.getElementById(id);
        let tag = input.tagName.toLowerCase();
				// Check type != date so we don't add listeners twice (see
				// above)
        if (input && input.getAttribute('geoladris-type') !== 'date') {
          input.addEventListener('input', updateButton);
        } else if (tag === 'select') {
          input.addEventListener('change', updateButton);
        }
      });

      updateButton();
    }

    let button = document.getElementById(msg.button);
    button.addEventListener('click', function () {
      if (!button.classList.contains('button-enabled')) {
        return;
      }

      let rawMessage = {};
      let i;
      for (i = 0; i < msg.divs.length; i++) {
        let fieldName = msg.divs[i];
        bus.send(fieldName + '-field-value-fill', rawMessage);
      }

      let translatedMessage;
      if (msg.names) {
        translatedMessage = {};
        for (i = 0; i < msg.divs.length; i++) {
          translatedMessage[msg.names[i]] = rawMessage[msg.divs[i]];
        }
      } else {
        translatedMessage = rawMessage;
      }
      bus.send(msg.clickEventName, translatedMessage);
    });
  });
}
