define([ "jquery" ], function($) {
	function getOrCreateDiv(id, parentId, innerComponent) {
		var div = $("#" + id);
		if (div.length == 0) {
			var parent = $("#" + parentId);
			div = $("<div/>").appendTo(parent).attr("id", id);
			if (!(typeof innerComponent === 'undefined')) {
				div.append(innerComponent());
			}
		}

		return div;
	}

	function append(button, parent, priority) {
		var nextDiv;

		if (priority) {
			button.attr("priority", priority);

			var children = parent.children();
			for (var i = 0; i < children.length; i++) {
				var child = $(children[i]);
				var p = child.attr("priority");
				if (!p || p > priority) {
					nextDiv = child;
					break;
				}
			}
		}

		if (nextDiv) {
			nextDiv.before(button);
		} else {
			parent.append(button);
		}
	}

	return {
		getOrCreateDiv : getOrCreateDiv,
		append : append
	};
});