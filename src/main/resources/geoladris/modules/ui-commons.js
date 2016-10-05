define([ "jquery" ], function($) {
	function getOrCreateDiv(msg) {
		var div = $("#" + msg.div);
		if (div.length === 0) {
			div = $("<div/>").attr("id", msg.div);
			div.addClass(msg.css);

			var parent = $("#" + msg.parentDiv);
			append(div, parent, msg.priority);
		}

		return div;
	}

	function append(div, parent, priority) {
		var nextDiv;

		if (priority) {
			div.attr("priority", priority);

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
			nextDiv.before(div);
		} else {
			parent.append(div);
		}
	}

	return {
		getOrCreateDiv : getOrCreateDiv,
		append : append
	};
});