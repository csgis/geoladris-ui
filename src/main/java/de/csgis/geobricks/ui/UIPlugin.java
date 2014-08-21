package de.csgis.geobricks.ui;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;
import de.csgis.geobricks.NonRequireDependency;
import de.csgis.geobricks.PluginDescriptor;

public class UIPlugin implements PluginDescriptor {
	public static final String ID = "ui";
	public static final String NAME = "UI";

	@Override
	public NonRequireDependency[] getNonRequireDependencies() {
		return new NonRequireDependency[] { new NonRequireDependency(
				"typeahead", "jslib/typeahead/0.10.2/typeahead.jquery.min") };
	}

	@Override
	public String getDefaultConfiguration() {
		return "{ui : []}";
	}

	@Override
	public String[] getStyleSheets() {
		return new String[] { "modules/accordion.css", "modules/title.css",
				"modules/toolbar.css", "modules/buttons.css",
				"modules/dialog.css", "modules/autocomplete.css",
				"modules/alerts.css", "modules/loading.css" };
	}

	@Override
	public String getName() {
		return NAME;
	}

	@Override
	public String getId() {
		return ID;
	}

	@Override
	public String[] getModules() {
		return new String[] { "ui" };
	}

	public void config(HttpServletRequest request,
			HttpServletResponse response, JSONObject staticConfig,
			String confDir) {
	};
}
