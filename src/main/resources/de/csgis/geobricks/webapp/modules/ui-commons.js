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

	return {
		getOrCreateDiv : getOrCreateDiv
	};
});