function replaceParent(id) {
	var previous = document.getElementById(id);
	if (previous) {
		document.body.removeChild(previous);
	}

	var parent = document.createElement('div');
	parent.setAttribute("id", id);
	document.body.appendChild(parent);
}