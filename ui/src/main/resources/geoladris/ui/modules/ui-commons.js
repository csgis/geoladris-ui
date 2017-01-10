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

	function getOrCreateElem(type, props) {
		var elem = $("#" + props.id);
		if (elem.length === 0) {
			elem = $("<" + type + "/>").attr("id", props.id);
			elem.addClass(props.css);

			var parent = $("#" + props.parent);
			append(elem, parent, props.priority);
		}

		return elem;
	}

	function append(elem, parent, priority) {
		var nextElem;

		if (priority) {
			elem.attr("priority", priority);

			var children = parent.children();
			for (var i = 0; i < children.length; i++) {
				var child = $(children[i]);
				var p = child.attr("priority");
				if (!p || p > priority) {
					nextElem = child;
					break;
				}
			}
		}

		if (nextElem) {
			nextElem.before(elem);
		} else {
			parent.append(elem);
		}
	}

	return {
		getOrCreateDiv : getOrCreateDiv,
		getOrCreateElem : getOrCreateElem,
		append : append
	};
});