import di from '@csgis/di';

let bus = null;
let elemLists = [];

function init() {
  if (bus) return; // already initalized

  bus = di.get('bus');
  bus.listen('ui-show', function (e, id) {
    for (let i = 0; i < elemLists.length; i++) {
      let j;
      let divList = elemLists[i];
      let showIndex = -1;
      for (j = 0; j < divList.length; j++) {
        if (divList[j] === id) {
          showIndex = j;
          break;
        }
      }

      if (showIndex !== -1) {
        for (j = 0; j < divList.length; j++) {
          if (divList[j] !== showIndex) {
            bus.send('ui-hide', divList[j]);
          }
        }
      }
    }
  });
}

export default function (elems) {
  init();
  elemLists.push(elems);
  for (let i = 1; i < elems.length; i++) {
    bus.send('ui-hide', elems[i]);
  }
}
