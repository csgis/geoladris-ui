function replaceParent(parentId) {
	var previous = document.getElementById(parentId);
	if (previous) {
		document.body.removeChild(previous);
	}

	var parent = document.createElement('div');
	parent.setAttribute('id', parentId);
	document.body.appendChild(parent);
}

export { replaceParent };
