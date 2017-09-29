const PARENT_ID = 'parent';

export function replaceParent() {
  var previous = document.getElementById(PARENT_ID);
  if (previous) {
    document.body.removeChild(previous);
  }

  var parent = document.createElement('div');
  parent.setAttribute('id', PARENT_ID);
  document.body.appendChild(parent);
}

export { PARENT_ID };
