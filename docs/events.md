# UI events - General

## <a name="ui-show"></a>ui-show


Message (*String*, mandatory): Identifier of the div to show.

Example:
```javascript
bus.send("ui-show", "mydiv");
```

## <a name="ui-hide"></a>ui-hide

Message (*String*, mandatory): Identifier of the div to hide.

Example:
```javascript
bus.send("ui-hide", "mydiv");
```

## <a name="ui-toggle"></a>ui-toggle

Message (*String*, mandatory): Identifier of the div to toggle visibility.

Example:
```javascript
bus.send("ui-toggle", "mydiv");
```

## ui-open-url

Message (*Object*):

* **url** (*String*, mandatory): URL to open.
* **target** (*String*, mandatory): Target attribute or name of the window.

Example:
```js
bus.send("ui-open-url", {
    url : "http://www.google.es",
    target : "_blank"
});
```

## ui-alert

Message (*Object*):

* **severity** (*String*, mandatory): Can be anything as long as there is a CSS rule named *ui-alert-<severity>* to style the alert.
* **message** (*String*, mandatory): The message to show in the alert. It does **not** accept HTML code.

Example:
```js
bus.send("ui-alert", {
    severity : "info",
    message : "Operation successful."
});
```

## ui-loading:start

Message (*String*, mandatory): The text to be shown on a loading message.

Example:
```js
bus.send("ui-loading:start", "Bitte warten Sie");
```

## ui-loading:end

Message (*String*, mandatory): The text to be removed from the loading message.

Example:
```js
bus.send("ui-loading:end", "Bitte warten Sie");
```

# UI events - Simple components

## ui-accordion:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the accordion to create.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the accordion.
* **css** (*String*, optional): CSS class to add to the accordion.

Example:
```js
bus.send("ui-accordion:create", {
    div : "myaccordion",
    parentDiv : layout.side,
    css : "accordion"
});
```

## <a name="ui-accordion-add-group"></a>ui-accordion:add-group

Message (*Object*):

* **accordion** (*String*, mandatory): Identifier of the accordion where the group should be added.
* **id** (*String*, mandatory): Identifier of the group to create.
* **title** (*String*, mandatory): Text to show in the group header.
* **visible** (*boolean*): Determines wether the content should be visible or not; this is, wether the accordion group should be collapsed or not. Default is *false*.

Example:
```js
bus.send("ui-accordion:add-group", {
    accordion : "myaccordion",
    id : "layers",
    title : "My Layers",
    visible : true
});
```


## ui-accordion:`<group-id>`:visibility

`<group-id>` matches the *id* specified when creating the [accordion group](#ui-accordion-add-group).

Message (*Object*):

* **header** (*boolean*, optional): Determines wether the header of the group should be visible or not. If not specified, the visibility is not changed.
* **content** (*boolean*, optional): Determines wether the content of the group should be visible or not. If not specified, the visibility is not changed.

Example:
```js
bus.send("ui-accordion:layers:visibility", {
    header : true,
    content : false
});
```

## <a name="ui-autocomplete-create"></a>ui-autocomplete:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the autocomplete control to create.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the autocomplete control.
* **css** (*String*, optional): CSS class to add to the autocomplete control.
* **options** (*Array* of *String*, mandatory): Available options for the autocomplete control.
* **placeholder** (*String*, optional): Placeholder to show in the autocomplete control.
* **label** (*String*, optional): Label to show before the autocomplete control.
* **hint** (*boolean*): Determines if the autocomplete control should show a hint (greyed autocompleted value) or not.
* **minQueryLength** (*int*, optional): Minimum number of characters that have to be written before the autocomplete options appear. If it's 0, options appear whenever the autocomplete control is focused. Default value is 0.
* **searchMode** (*String*, optional): One of ``startsWith`` or ``contains``. Determines the type of filtering to be used by the control. Default is ``startsWith``.
* **maxResults** (*int*, optional): Maximum number of results to be shown on the autocomplete control. If 0 or less is specified, all results will be shown. Default is 0.
* **showOnFocus** (*boolean*): Determines wether the autocomplete options will be shown when the control gains focus or not. Note that if the current text is shorter than *minQueryLength*, options won't be shown even if this option is *true*.

Example:
```js
bus.send("ui-autocomplete:create", {
    div : "myautocomplete",
    parentDiv : "mydialog",
    css : "autocomplete",
    options : [ "One", "Two", "Three" ],
    placeholder : "Number",
    label : "Choose a number: ",
    hint : true,
    minQueryLength : 3,
    searchMode : "startsWith",
    maxResults : 5,
    showOnFocus : true
});
```

## ui-autocomplete:`<id>`:set-values

`<id>` matches the *div* specified when creating the [autocomplete](#ui-autocomplete-create).

Message (*Array* of *String*): Values to set for autocompletion.

Example:
```js
bus.send("ui-autocomplete:myautocomplete:set-values", [ [ "1", "2", "3" ] ]);
```

## <a name="ui-autocomplete-set-value"></a>ui-autocomplete:`<id>`:set-value

`<id>` matches the *div* specified when creating the [autocomplete](#ui-autocomplete-create).

Message (*String*): Value to set on the autocompletion input field.

Example:
```js
bus.send("ui-autocomplete:myautocomplete:set-value", "1");
```

## ui-autocomplete:`<id>`:selected

`<id>` matches the *div* specified when creating the [autocomplete](#ui-autocomplete-create).

Message (*String*): Selected value from the *options* array specified when setting the [values](#ui-autocomplete-set-values).

Example:
```js
bus.send("ui-autocomplete:myautocomplete:selected", "One");
```

## <a name="ui-button-create"></a>ui-button:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the div/button to create.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the button.
* **css** (*String*, optional): CSS class to add to the button.
* **tooltip** (*String*, optional): Tooltip to show on mouse over.
* **priority** (*int*, optional): Priority of the button. If priority is specified, the button will be added at the corresponding index to the parent div, depending on the priorities of the other elements. If priority is not specified, the button will be added at the end.
* **text** (*String*, **text** or **image** mandatory): The text to show in the button.
* **image** (*String*, **text** or **image** mandatory): The image to show in the button background.
* **sendEventName** (*String*, optional): Name of the event to send when the button is clicked.
* **sendEventMessage** (*?*, optional): The message to send when the button is clicked.

Example:
```js
bus.send("ui-button:create", {
    div : "mybutton",
    parentDiv : "mytoolbar",
    css : "mybutton-class",
    priority : 200,
    image : "images/button.png",
    sendEventName : "button-clicked",
    sendEventMessage : "mybutton"
});
```

## ui-button:`<id>`:enable

`<id>` matches the *div* specified when creating the [button](#ui-button-create).

Message (*boolean*, mandatory): Determines whether the button should be enabled or not.

Example:
```js
bus.send("ui-button:mybutton:enable", true);
```

## ui-button:`<id>`:activate

`<id>` matches the *div* specified when creating the [button](#ui-button-create).

Message (*boolean*, mandatory): Determines whether the button should be active or not.

Example:
```
bus.send("ui-button:mybutton:activate", true);
```

## ui-button:`<id>`:toggle

`<id>` matches the *div* specified when creating the [button](#ui-button-create).

Message (*Empty*).

Example:
```js
bus.send("ui-button:mybutton:toggle");
```

## ui-button:`<id>`:link-active

`<id>` matches the *div* specified when creating the [button](#ui-button-create).

Message (*String*, mandatory): Identifier of the div to link active state. Button state will change on [ui-show](#ui-show), [ui-hide](#ui-hide) and [ui-toggle](#ui-toggle) events for this div.

Example:
```js
bus.send("ui-button:mybutton:link-active", "mydialog");
```

## <a name="ui-choice-field-create"></a>ui-choice-field:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the choice field to create.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the choice field.
* **css** (*String*, optional): CSS class to add to the choice field.
* **label** (*String*, optional): Label to show before the choice field.
* **values** (*Array* of *Object*, optional): Available values for the choice field. Each object must have ``value`` (the field value itself) and ``text`` (the display text for the value).

Example:
```js
bus.send("ui-choice-field:create", {
    div : "mychoice",
    parentDiv : "mydialog",
    css : "choice-field",
    label : "Number: ",
    values : [ "One", "Two", "Three" ]
});
```

## ui-choice-field:`<id>`:add-value

`<id>` matches the *div* specified when creating the [choice field](#ui-choice-field-create).

Message (*String*): Value to add.

Example:
```js
bus.send("ui-choice-field:mychoice:add-value", "Four");
```

## ui-choice-field:`<id>`:set-values

`<id>` matches the *div* specified when creating the [choice field](#ui-choice-field-create).

Message (*Array* of *String*): Values to set.

Example:
```js
bus.send("ui-choice-field:mychoice:set-values", [ [ "1", "2", "3" ] ]);
```

## ui-confirm-dialog:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the confirm dialog.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the confirm dialog.
* **css** (*String*, optional): CSS class to add to the confirm dialog.
* **messages** (*Object*):
    * **question**: Question to be confirmed or not. Optional.
    * **yes**: Text for the *ok* button.
    * **no**: Text for the *cancel* button.
* Any other property that can be accepted by [ui-dialog:create](#ui-dialog-create).

Example:
```js
bus.send("ui-confirm-dialog:create", {
    div : "mydialog",
    parentDiv : layout.center,
    css : "mydialogclass",
    title : "My Dialog",
    closeButton : true
});
```

## <a name="ui-dialog-create"></a>ui-dialog:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the dialog div.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the dialog div.
* **css** (*String*, optional): CSS class to add to the dialog div.
* **title** (*String*, optional): Dialog title.
* **closeButton** (*boolean*): Determines wether the dialog has a close button or not.
* **modal** (*boolean*): Determines if the dialog is modal or not.
* **visible** (*boolean*): Determines wether the dialog should be shown when created or not.

Example:
```js
bus.send("ui-dialog:create", {
    div : "mydialog",
    parentDiv : layout.center,
    css : "mydialogclass",
    title : "My Dialog",
    closeButton : true
});
```

## ui-divstack:create

Message (*Array* of *String*, mandatory): Array of div identifiers. These divs will be mutually exclusive; if a div is shown all the others will be hidden. This event does **not** create the divs.

Example:
```js
bus.send("ui-divstack:create", ["mydiv", "mydiv2", "mydiv3"]);
```

## <a name="ui-dropdown-button-create"></a>ui-dropdown-button:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the dropdown button.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the dropdown button.
* **css** (*String*, optional): CSS class to add to the dropdown button.
* Any other property that can be accepted by [ui-button:create](#ui-button-create).

Example:
```js
bus.send("ui-dropdown-button:create", {
    div : "mydropdown",
    parentDiv : "layout-center",
    tooltip : "Dropdown button"
});
```

## <a name="ui-dropdown-button-add-item"></a>ui-dropdown-button:`<id>`:add-item

`<id>` matches the *div* specified when creating the [dropdown button](#ui-dropdown-button-create).

Message (*Object*):

* **id** (*String*, mandatory): Identifier of the dropdown item.
* **text** (*String*, mandatory): Text to be shown for the dropdown item.
* **tooltip** (*String*, optional): Tooltip to show on mouse over.

Example:
```js
bus.send("ui-dropdown-button:mydropdown:add-item", {
    id : "item1",
    text : "Item 1",
    tooltip : "My item tooltip"
});
```

## ui-dropdown-button:`<id>`:set-item

`<id>` matches the *div* specified when creating the [dropdown button](#ui-dropdown-button-create).

Message (*String*, mandatory): Identifier of the item to set, as specified on [ui-dropdown-button:&lt;id&gt;:add-item](#ui-dropdown-button-add-item).

Example:
```js
bus.send("ui-dropdown-button:mydropdown:set-item", "item1");
```

## ui-dropdown-button:`<id>`:item-selected

`<id>` matches the *div* specified when creating the [dropdown button](#ui-dropdown-button-create).

Message (*String*, mandatory): Identifier of the item that has been selected, as specified on [ui-dropdown-button:&lt;id&gt;:add-item](#ui-dropdown-button-add-item).

Example:
```js
bus.send("ui-dropdown-button:mydropdown:item-selected", "item1");
```

## <a name="ui-exclusive-list-create"></a>ui-exclusive-list:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the exclusive list div.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the exclusive list.
* **css** (*String*, optional): CSS class to add to the exclusive list.

Example:
```js
bus.send("ui-exclusive-list:create", {
    div : "base-layer",
    parentDiv : "myaccordion",
    css : "baselayer"
});
```

## <a name="ui-exclusive-list-add-item"></a>ui-exclusive-list:`<id>`:add-item

`<id>` matches the *div* specified when creating the [exclusive list](#ui-exclusive-list-create).

Message (*Object*):

* **id** (*String*, mandatory): Identifier of the item to add.
* **text** (*String*, mandatory): Text to show for the new item.

Example:
```js
bus.send("ui-exclusive-list:base-layer:add-item", {
    id : "osm",
    text : "Open Street Map"
});
```

## ui-exclusive-list:`<id>`:remove-item

`<id>` matches the *div* specified when creating the [exclusive list](#ui-exclusive-list-create).

Message (*String*, mandatory): Identifier of the item to remove. It must be one of the items added with [ui-exclusive-list:&lt;id&gt;:add-item](#ui-exclusive-list-add-item).

Example:
```js
bus.send("ui-exclusive-list:base-layer:remove-item", "osm");
```

## ui-exclusive-list:`<id>`:set-item

`<id>` matches the *div* specified when creating the [exclusive list](#ui-exclusive-list-create).

Message (*String*, mandatory): Identifier of the item to set. It must be one of the items added with [ui-exclusive-list:&lt;id&gt;:add-item](#ui-exclusive-list-add-item).

Example:
```js
bus.send("ui-exclusive-list:base-layer:set-item", "osm");
```

## ui-exclusive-list:`<id>`:item-selected

`<id>` matches the *div* specified when creating the [exclusive list](#ui-exclusive-list-create).

Message (*String*, mandatory): Identifier of the item that has been selected. It is one of the items added with [ui-exclusive-list:&lt;id&gt;:add-item](#ui-exclusive-list-add-item).

Example:
```js
bus.send("ui-exclusive-list:base-layer:item-selected", "osm");
```

## ui-form-collector:extend

With this event you can gather data from a set of input controls and send an event with that data.

Message (*Object*):

* **button** (*String*, mandatory): Identifier of the button that will trigger the form collection and event send.
* **sendEventName** (*String*, mandatory): Event to send when the button is clicked.
* **divs** (*Array* of *String*, mandatory): Set of divs to gather data. These fields must implement the `<field>-field-value-fill`_ event.
* **requiredDivs** (*Array* of *String*, optional): Subset of ``divs``. All these fields must have non empty values for the ``button`` to be enabled, otherwise it's disabled. Works for fields created with the ``ui-input-field:create`` and ``ui-choice-field:create`` events.
* **names** (*Array* of *String*, optional): Set of attribute names to use for the event message. If not specified, the div identifiers will be used as attribute names for event message.

Example:
```js
bus.send("ui-form-collector:extend", {
    button : "button-ok",
    sendEventName : "zoomTo",
    divs : [ "input-crs", "input-x", "input-y" ],
    names : [ "crs", "lon", "lat" ]
});
```

## `<field>`-field-value-fill

The fields that implement this event are:

* [ui-autocomplete:create](#ui-autocomplete-create).
* [ui-choice-field:create](#ui-choice-field-create).
* [ui-input-field:create](#ui-input-field-create).
* [ui-slider:create](#ui-slider-create).
* [ui-text-area-field:create](#ui-text-area-field-create).

## ui-html:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the div.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the html div.
* **css** (*String*, optional): CSS class to add to the div.
* **html** (*String*, optional): HTML content of the div.

Example:
```js
bus.send("ui-html:create", {
    div : "mydiv",
    parentDiv : layout.center,
    css : "mydiv",
    html : "<p>This is <b>HTML</b> content.</p>"
});
```

## <a name="ui-input-field-create"></a>ui-input-field:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the input field.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the input field.
* **css** (*String*, optional): CSS class to add to the input field.
* **label** (*String*, optional): Label to show before the input field.
* **type** (*String*, optional): Type of input. It must be one of the values supported by the `<input>` tag for the *type* attribute. Default is *text*.

Example:
```js
bus.send("ui-input-field:create", {
    div : "login-user",
    parentDiv : "mydialog",
    css : "login-field",
    label : "User: ",
    type : "password"
});
```

## <a name="ui-search-box-create"></a>ui-search-box:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the search box.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the search box.
* **css** (*String*, optional): CSS class to add to the search box.
* **placeholder** (*String*, optional): Placeholder to show in the search box.
* **icon** (*boolean*): Determines wether the search box should have a search icon or not. Default is *false*.

Example:
```js
bus.send("ui-search-box:create", {
    div : "address-search",
    parentDiv : layout.center,
    css : "search",
	placeholder : "Street: ",
    icon : true
});
```

## ui-search-box:`<id>`:search

`<id>` matches the *div* specified when creating the [search box](#ui-search-box-create).

Message (*String*, mandatory): Text to use for the search.

Example:
```js
bus.send("ui-search-box:address-search:search", "Max Joseph");
```

## <a name="ui-search-results-create"></a>ui-search-results:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the search results div.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the search results div.
* **css** (*String*, optional): CSS class to add to the search results div.
* **title** (*String*, optional): Title to show on the search results div.
* **visible** (*boolean*): Determines wether the search results div should be visible when created or not.

Example:
```js
bus.send("ui-search-results:create", {
    div : "address-search-results",
    parentDiv : layout.center,
    css : "search-results",
    title : "Results",
    visible : false
});
```

## ui-search-results:`<id>`:add

`<id>` matches the *div* specified when creating the [search results div](#ui-search-results-create).

Message (*String*): Text to be added to the results div.

Example:
```js
bus.send("ui-search-results:address-search-results:add", "Max Joseph Strasse");
```

## ui-search-results:`<id>`:selected

`<id>` matches the *div* specified when creating the [search results div](#ui-search-results-create).

Message (*String*, mandatory): Text of the selected result.

Example:
```js
bus.send("ui-search-box:address-search-results:search", "Max Joseph Strasse");
```

## ui-search-results:`<id>`:clear

`<id>` matches the *div* specified when creating the [search results div](#ui-search-results-create).

Message (*Empty*).
```js
bus.send("ui-search-results:address-search-results:clear");
```

## <a name="ui-selectable-list-create"></a>ui-selectable-list:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the selectable list div.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the selectable list.
* **css** (*String*, optional): CSS class to add to the selectable list.

Example:
```js
bus.send("ui-selectable-list:create", {
    div : "layers",
    parentDiv : layout.side,
    css : "layer-list",
});
```

## <a name="ui-selectable-list-add-item"></a>ui-selectable-list:`<id>`:add-item

`<id>` matches the *div* specified when creating the [selectable list](#ui-selectable-list-create).

Message (*Object*):

* **listId** (*String*, mandatory): Identifier of the list where the item should be added.
* **id** (*String*, mandatory): Identifier of the item to add.
* **text** (*String*, mandatory): Text to show for the new item.

Example:
```js
bus.send("ui-selectable-list:add-item", {
    listId : "layers",
    id : "osm",
    text : "Open Street Map"
});
```

## ui-selectable-list:`<id>`:remove-item

`<id>` matches the *div* specified when creating the [selectable list](#ui-selectable-list-create).

Message (*String*, mandatory): Identifier of the item to remove from the selectable list as specified with `id` on [ui-selectable-list:&lt;id&gt;:add-item](#ui-selectable-list-add-item).

Example:
```js
bus.send("ui-selectable-list:layers:remove-item", "osm");
```

## ui-selectable-list:`<id>`:set-item

`<id>` matches the *div* specified when creating the [selectable list](#ui-selectable-list-create).

Message (*Object*):

* **id** (*String*, mandatory): Identifier of the selectable list item to set as specified with `id` on [ui-selectable-list:&lt;id&gt;:add-item](#ui-selectable-list-add-item).
* **selected** (*boolean*): Determines wether the item should be selected or not. 

Example:
```js
bus.send("ui-selectable-list:layers:set-item", {
    id : "osm",
    selected : false
});
```

## ui-selectable-list:`<id>`:item-selected

`<id>` matches the *div* specified when creating the [selectable list](#ui-selectable-list-create).

Message (*String*, mandatory): Identifier of the selected item as specified with `id` on [ui-selectable-list:&lt;id&gt;:add-item](#ui-selectable-list-add-item).

Example:
```js
bus.send("ui-selectable-list:layers:item-selected", "osm");
```

## ui-selectable-list:`<id>`:item-unselected

`<id>` matches the *div* specified when creating the [selectable list](#ui-selectable-list-create).

Message (*String*, mandatory): Identifier of the unselected item as specified with `id` on [ui-selectable-list:&lt;id&gt;:add-item](#ui-selectable-list-add-item).

Example:
```js
bus.send("ui-selectable-list:layers:item-unselected", "osm");
```

## <a name="ui-slider-create"></a>ui-slider:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the slider to create.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the slider.
* **css** (*String*, optional): CSS class to add to the slider.
* **label** (*String*, optional): Label to show before the slider.
* **values** (*Array* of *String*, optional): Available values for the slider.

Example:
```js
bus.send("ui-slider:create", {
    div : "myslider",
    parentDiv : "mydialog",
    css : "slider",
    label : "Number: ",
    values : [ "One", "Two", "Three" ]
});
```

## ui-slider:`<id>`:add-value

`<id>` matches the *div* specified when creating the [slider](#ui-slider-create).

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the slider to add the value.
* **value** (*String*, mandatory): Value to add.

Example:
```js
bus.send("ui-slider:add-value", {
    div : "myslider",
    value : "Four"
});
```

## ui-sliding-div:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the sliding div.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the sliding div.
* **css** (*String*, optional): CSS class to add to the sliding div.
* **direction** (*String*, optional): Sliding direction. Available options are ``horizontal``, ``vertical`` and ``both``. Default is ``vertical``.
* **handlePosition** (*String*, optional): Position for the handle that expands/collapses the div. Available options are ``left``, ``right``, ``top``, ``bottom``, ``top-left``, ``bottom-left``, ``top-right``, ``bottom-right``. Default is ``bottom``.
* **visible** (*boolean*, optional): Determines whether to show or hide the div when created. Default is ``false``.

Example:
```js
bus.send("ui-sliding-div:create", {
    div : "mysliding",
    parentDiv : "layout-center",
    css : "sliding-div",
    direction : "both",
    handlePosition : "bottom-right",
    visible : true
});
```

## ui-sliding-div:expand

Message (*String*, mandatory): Id of the sliding div to expand.

Example:
```js
bus.send("ui-sliding-div:expand", "mysliding");
```

## ui-sliding-div:collapse

Message (*String*, mandatory): Id of the sliding div to collapse.

Example:
```js
bus.send("ui-sliding-div:collapse", "mysliding");
```

## ui-sliding-div:toggle

Message (*String*, mandatory): Id of the sliding div to toggle.

Example:
```js
bus.send("ui-sliding-div:toggle", "mysliding");
```

## <a name="ui-table-create"></a>ui-table:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the text area to create.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the text area.
* **css** (*String*, optional): CSS class to add to the text area.
* **label** (*String*, optional): Label to show before the text area field.
* **rows** (*int*, optional): Number of rows for the text area.
* **cols** (*int*, optional): Number of columns for the text area.
* **hasColumnSelection** (*boolean*, optional): Enable to show a button above the table that allows dynamic column selection. Default is ``false``.
* **messages** (*Object*, optional): Translation messages for the table. Currently supports the following messages:

  * **info**: Specifies which page and/or rows are being shown among the total. It's possible to use the following placeholders: ``_PAGE_``, ``_PAGES_``, ``_START_``, ``_END_``, ``_TOTAL_``.

Example:
```js
bus.send("ui-table:create", {
    div : "mytable",
    parentDiv : "layout-center"
    css : "table-class",
    messages : {
        "info" : "Showing records from _START_ to _END_. Total: _TOTAL_."
    }
});
```

## ui-table:`<id>`:clear

`<id>` matches the *div* specified when creating the [table](#ui-table-create).

Message (*Empty*).

Example:
```js
bus.send("ui-table:mytable:clear");
```

## ui-table:`<id>`:adjust

Used to adjust the column width, usually when the table is shown. `<id>` matches the *div* specified when creating the [table](#ui-table-create).

Message (*Empty*).

Example:
```js
bus.send("ui-table:mytable:adjust");
```

## <a name="ui-table-set-data"></a>ui-table:`<id>`:set-data

`<id>` matches the *div* specified when creating the [table](#ui-table-create).

Message (*Object*):

* **data** (*Array* of *Object*, mandatory): Array with the data to fill the table. All objects should in the array should have the same properties.
* **fields** (*Object*, mandatory): Names of the fields to show on the table. Each property key on the object is the display name and the property value is the propery name to be used on the *data* array of objects.
* **idColumn** (*int*, mandatory): Column index (in ``fields``) to use as identifier for row selection.

Example:
```js
bus.send("ui-table:mytable:set-data", {
    "data" : [{
        "number" : "1",
        "char" : "a"
    },{
        "number" : "2",
        "char" : "b"
    },{
        "number" : "3",
        "char" : "c"
    }],
    "fields" : {
        "Nr." : "number",
        "Character" : "char"
    }
});
```

## ui-table:`<id>`:data-selected

`<id>` matches the *div* specified when creating the [table](#ui-table-create).

Message (*Array* of *Object*): Array with the selected objects (subset of the array provided on [ui-table:&lt;id&gt;:set-data](#ui-table-set-data)). All objects should in the array should have the same properties.

Example:
```js
bus.send("ui-table:mytable:data-selected", [[{
    "number" : "3",
    "char" : "c"
}]]);
```

## ui-table:`<id>`:select-data

`<id>` matches the *div* specified when creating the [table](#ui-table-create).

Message (*Array* of *Object*): Array with the selected objects (subset of the array provided on [ui-table:&lt;id&gt;:set-data](#ui-table-set-data)). All objects should in the array should have the same properties.

Example:
```js
bus.send("ui-table:mytable:select-data", [[{
    "number" : "3",
    "char" : "c"
}]]);
```

## ui-table:`<id>`:invert-selection

`<id>` matches the *div* specified when creating the [table](#ui-table-create).

Message: Empty.

Example:
```js
bus.send("ui-table:mytable:invert-selection");
```

## ui-table:`<id>`:sort-selected-first

`<id>` matches the *div* specified when creating the [table](#ui-table-create).

Message: Empty.

Example:
```js
bus.send("ui-table:mytable:sort-selected-first");
```

## ui-table:`<id>`:filter

`<id>` matches the *div* specified when creating the [table](#ui-table-create).

Message (*String*): Text to filter the rows on the table.

Example:
```js
bus.send("ui-table:mytable:filter", "Male");
```

## ui-table:`<id>`:row-selection-changed

`<id>` matches the *div* specified when creating the [table](#ui-table-create).

Message (*Object*):

* **id** (*String*, mandatory): Identifier of the row changing selection.
* **selected** (*boolean*, mandatory): ``true`` if the row has been selected, ``false`` otherwise.

Example:
```js
bus.send("ui-table:mytable:row-selection-changed", {
    id : "4759",
    selected : true
});
```

## ui-table:`<id>`:column-visibility-changed

`<id>` matches the *div* specified when creating the [table](#ui-table-create).

Message (*Array* of *int*, mandatory): Array containing the indexes of the currently visible columns.

Example:
```js
bus.send("ui-table:mytable:column-visibility-changed", [[ 1, 2, 4, 7 ]]);
```

## <a name="ui-text-area-field-create"></a>ui-text-area-field:create

Message (*Object*):

* **div** (*String*, mandatory): Identifier of the text area to create.
* **parentDiv** (*String*, mandatory): Identifier of the div that will contain the text area.
* **css** (*String*, optional): CSS class to add to the text area.
* **label** (*String*, optional): Label to show before the text area field.
* **rows** (*int*, optional): Number of rows for the text area.
* **cols** (*int*, optional): Number of columns for the text area.

Example:
```js
bus.send("ui-text-area-field:create", {
    div : "mytextarea",
    parentDiv : "mydialog",
    css : "text-area",
    rows : 2,
    cols : 40
});
```

## ui-text-area-field:`<id>`:set-value

`<id>` matches the *div* specified when creating the [text area](#ui-text-area-field-create).

Message (*String*): Text to set in the text area.

Example:
```js
bus.send("ui-text-area-field:mytextarea:set-value", "This is a sample text for the area field");
```

## ui-text-area-field:`<id>`:append

`<id>` matches the *div* specified when creating the [text area](#ui-text-area-field-create).

Message (*String*): String to append on the text area.

Example:
```js
bus.send("ui-text-area-field:login-user:append", "-suffix");
```
