define([ "jquery" ], function($) {
	function getOrCreateElem(type, props) {
		var elem = $("#" + props.id);
		if (elem.length === 0) {
			elem = $("<" + type + "/>").attr("id", props.id);
			elem.addClass(props.css);

			var parent = $("#" + props.parent);
			append(elem, parent, props.priority);
		}

		if (props.html) {
			elem.html(props.html);
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
		getOrCreateElem : getOrCreateElem,
		append : append
	};
});