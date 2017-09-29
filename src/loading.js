import commons from './commons';
import di from '@csgis/di';

class Loader {
  constructor(opts) {
    this.ids = {};
    this.originalMessage = opts.originalMessage || 'Loading';

    this.createUI();
    this.wire();
  }

  createUI() {
    this.loadingShade = commons.getOrCreateElem('div', {
      id: 'wait-mask',
      parent: document.body
    });
    this.loadingMsg = commons.getOrCreateElem('div', {
      id: 'loading-msg',
      parent: this.loadingShade
    });

    this.loadingShade.style.display = 'none';
  }

  wire() {
    const bus = di.get('bus');
    const that = this;
    bus.listen('ui-loading:start', function (e, msg) {
      if (that.ids[msg]) {
        that.ids[msg]++;
      } else {
        that.ids[msg] = 1;
      }

      that.updateMessage();
      that.loadingShade.style.display = '';
      that.loadingMsg.style.width = that.loadingMsg.offsetWidth + 'px';

      if (!that.intervalId) {
        // Add a dot to the message each 0.5s, up to 3 dots
        that.intervalId = setInterval(function () {
          let divText = that.loadingMsg.innerHTML;
          if (divText.length < that.message.length + 3) {
            that.loadingMsg.innerHTML = divText + '.';
          } else {
            that.loadingMsg.innerHTML = that.message;
          }
        }, 500);
      }
    });

    bus.listen('ui-loading:end', function (e, msg) {
      if (!that.ids[msg] || that.ids[msg] <= 0) {
        console.warn('Trying to finish non-started loading: ' + msg);
        return;
      }

      that.ids[msg]--;
      if (!that.ids[msg]) {
        delete that.ids[msg];
      }

      let anyoneLoading = false;
      Object.keys(that.ids).forEach(function (key) {
        if (that.ids[key]) {
          anyoneLoading = true;
        }
      });

      if (!anyoneLoading) {
        that.loadingShade.style.display = 'none';
        clearInterval(that.intervalId);
        that.intervalId = null;
      } else {
        that.updateMessage();
      }
    });
  }

  updateMessage() {
    let keys = Object.keys(this.ids);
    this.message = (keys.length === 1) ? keys[0] : this.originalMessage;
    this.loadingMsg.innerHTML = this.message + '...';
  }
}

let loader;
export default function (opts) {
  if (!loader) loader = new Loader(opts || {});
}
