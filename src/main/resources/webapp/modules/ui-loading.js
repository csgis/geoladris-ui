define([ "jquery", "message-bus", "module" ], function($, bus, module) {
	var ids = {};

	var config = module.config();
	if (!config.originalMessage) {
		config.originalMessage = "Loading";
	}
	var message;
	var intervalId;

	// Create divs
	var loadingShade = $("<div/>").attr("id", "loading-shade");
	var loadingMsg = $("<div/>").attr("id", "loading-msg");
	loadingShade.append(loadingMsg);
	$("body").append(loadingShade);

	// Hide divs by default
	loadingShade.hide();

	function updateMessage() {
		var keys = Object.keys(ids);
		if (keys.length == 1) {
			message = keys[0];
		} else {
			message = config.originalMessage;
		}
		loadingMsg.text(message + "...");
	}

	bus.listen("ui-loading:start", function(e, msg) {
		if (ids[msg]) {
			ids[msg]++;
		} else {
			ids[msg] = 1;
		}

		updateMessage();
		loadingShade.show();
		loadingMsg.css("width", loadingMsg.width() + "px");

		if (!intervalId) {
			// Add a dot to the message each 0.5s, up to 3 dots
			intervalId = setInterval(function() {
				var divText = loadingMsg.text();
				if (divText.length < message.length + 3) {
					loadingMsg.text(divText + ".");
				} else {
					loadingMsg.text(message);
				}
			}, 500);
		}
	});

	bus.listen("ui-loading:end", function(e, msg) {
		if (!ids[msg] || ids[msg] <= 0) {
			console.warn("Trying to finish non-started loading: " + msg);
			return;
		}

		ids[msg]--;
		if (!ids[msg]) {
			delete ids[msg];
		}

		var anyoneLoading = false;
		$.each(ids, function(key, value) {
			if (value) {
				anyoneLoading = true;
			}
		});

		if (!anyoneLoading) {
			loadingShade.hide();
			clearInterval(intervalId);
			intervalId = null;
		} else {
			updateMessage();
		}
	});
});