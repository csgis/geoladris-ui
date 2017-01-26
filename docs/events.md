# UI Events

## General

### <a name="ui-show"></a>ui-show


Message (*String*, mandatory): Identifier of the div to show.

Example:
```javascript
bus.send("ui-show", "mydiv");
```

### <a name="ui-hide"></a>ui-hide

Message (*String*, mandatory): Identifier of the div to hide.

Example:
```javascript
bus.send("ui-hide", "mydiv");
```

### <a name="ui-toggle"></a>ui-toggle

Message (*String*, mandatory): Identifier of the div to toggle visibility.

Example:
```javascript
bus.send("ui-toggle", "mydiv");
```

### ui-open-url

This event can be managed directly with JS but it is useful for testing.

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

### ui-alert

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

### ui-loading:start

Message (*String*, mandatory): The text to be shown on a loading message.

Example:
```js
bus.send("ui-loading:start", "Bitte warten Sie");
```

### ui-loading:end

Message (*String*, mandatory): The text to be removed from the loading message.

Example:
```js
bus.send("ui-loading:end", "Bitte warten Sie");
```

## <a name="ui-creation"></a>Creation

UI creation is managed with a single function instead of a set of events. The function accepts the following arguments:

* **type** (*String*, mandatory): The type of element to create. There are some special element types with added functionality/elements (see list below); apart from that, any valid HTML tag (`div`, `a`, `p`) is a valid type.

  When a special element type matches a valid HTML tag (`input`, `table`, ...), the element is always created with added functionality/elements.

* **props** (*Object*, mandatory): Properties to create the element. The following properties are available for all element types (except when specified); special element types have special properties (see below):

  * **id** (*String*, mandatory): `id` attribute for the created element.
  * **parent** (*String*, mandatory): `id` attribute of the parent element where the new element should be added.
  * **css** (*String*, optional): CSS class(es) to apply to the new element.
  * **html** (*String*, optional): HTML (inner) content to set for the new element.
  * **priority** (*int*, optional): Element's priority. If priority is specified, the button will be added at the corresponding index to the parent div, depending on the priorities of the other elements. If priority is not specified, the button will be added at the end.

Whenever an element is created, a new event is sent with the DOM element:

```js
bus.send("ui:created", elem);
```


### <a name="ui-accordion-group"></a>accordion-group

Extra `props`:

* **title** (*String*, mandatory): Text to show in the group header.
* **visible** (*boolean*): Determines wether the content should be visible or not; this is, wether the accordion group should be collapsed or not. Default is *false*.

Example:
```js
ui.create("accordion-group", {
    id : "layers",
    parent : "parent",
    title : "My Layers",
    visible : true
});
```

### <a name="ui-autocomplete"></a>autocomplete

Extra `props`:

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
ui.create"autocomplete", {
    id : "myautocomplete",
    parent : "mydialog",
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

### <a name="ui-button"></a>button

Extra `props`:

* **tooltip** (*String*, optional): Tooltip to show on mouse over.
* **text** (*String*, **text** or **image** mandatory): The text to show in the button.
* **image** (*String*, **text** or **image** mandatory): The image to show in the button background.
* **clickEventName** (*String*, optional): Name of the event to send when the button is clicked.
* **clickEventMessage** (*any*, optional): The message to send when the button is clicked. It is ignored if *clickEventName* is not specified.
* **clickEventCallback** (*function*, optional): The callback to call when the button is clicked. It is ignored if *clickEventName* is also specified.

Example:
```js
ui.create("button", {
    id : "mybutton",
    parent : "mytoolbar",
    css : "mybutton-class",
    priority : 200,
    image : "images/button.png",
    clickEventName : "button-clicked",
    clickEventMessage : "mybutton"
});
```

### <a name="ui-checkbox"></a>checkbox

Extra `props`:

* **text** (*String*, mandatory): Text to show for the new item.

Example:
```js
ui.create("checkbox", {
    id : "osm",
    parent : "layer-list",
    css : "layerlist",
    text : "OSM"
});
```

### <a name="ui-choice-field"></a>choice

Extra `props`:

* **label** (*String*, optional): Label to show before the choice field.
* **values** (*Array* of *Object*, optional): Available values for the choice field. Each object must have ``value`` (the field value itself) and ``text`` (the display text for the value).

Example:
```js
ui.create("choice", {
    id : "mychoice",
    parent : "mydialog",
    css : "choice-field",
    label : "Number: ",
    values : [ "One", "Two", "Three" ]
});
```


### confirm-dialog

Extra `props`:

* **messages** (*Object*):
    * **question**: Question to be confirmed or not. Optional.
    * **yes**: Text for the *ok* button.
    * **no**: Text for the *cancel* button.
* Any other property that can be accepted by [dialog](#ui-dialog).

Example:
```js
ui.create("confirm-dialog", {
    id : "mydialog",
    parent : layout.center,
    css : "mydialogclass",
    title : "My Dialog",
    closeButton : true
});
```

### <a name="ui-dialog"></a>dialog

Extra `props`:

* **title** (*String*, optional): Dialog title.
* **closeButton** (*boolean*): Determines wether the dialog has a close button or not.
* **modal** (*boolean*): Determines if the dialog is modal or not.
* **visible** (*boolean*): Determines wether the dialog should be shown when created or not.

Example:
```js
ui.create("dialog", {
    id : "mydialog",
    parent : layout.center,
    css : "mydialogclass",
    title : "My Dialog",
    closeButton : true
});
```

### divstack

In this case `props` must be an array of div identifiers. These divs will be mutually exclusive; if a div is shown all the others will be hidden. This event does **not** create the divs.

Example:
```js
ui.create("divstack", ["mydiv", "mydiv2", "mydiv3"]);
```

### <a name="ui-dropdown-button"></a>dropdown-button

Same extra `props` as `button`s. Useful for `ui-dropdown-buttons:<id>:*` events.

Example:
```js
ui.create("dropdown-button", {
    id : "mydropdown",
    parent : "layout-center",
    tooltip : "Dropdown button"
});
```

### <a name="ui-input-field"></a>input

Extra `props`:

* **label** (*String*, optional): Label to show before the input field.
* **type** (*String*, optional): Type of input. It must be one of the values supported by the `<input>` tag for the *type* attribute. Default is *text*.

Example:
```js
ui.create("input", {
    id : "login-user",
    parent : "mydialog",
    css : "login-field",
    label : "User: ",
    type : "password"
});
```

### <a name="ui-radio"></a>radio

Extra `props`:

* **text** (*String*, mandatory): Text to show for the new item.

Example:
```js
ui.create("radio", {
    id : "osm",
    parent : "base-layer",
    css : "baselayer",
    text : "OpenStreetMap"
});
```

### <a name="ui-slider"></a>slider

Extra `props`:

* **label** (*String*, optional): Label to show before the choice field.
* **values** (*Array* of *Object*, optional): Available values for the choice field. Each object must have ``value`` (the field value itself) and ``text`` (the display text for the value).

The returned element listens to the `change` and `slide` events. Both return the selected value in `event.detail.value`.

Example:
```js
var slider = ui.create("slider", {
    id : "myslider",
    parent : "mydialog",
    css : "slider",
    label : "Number: ",
    values : [ 1, 2, 3 ]
});

slider.addEventListener("change", function(event) {
    console.log("Changed: " + event.detail.value);
});

slider.addEventListener("slide", function(event) {
    console.log("Slided: " + event.detail.value);
});
```


### sliding-div

Extra `props`:

* **direction** (*String*, optional): Sliding direction. Available options are ``horizontal``, ``vertical`` and ``both``. Default is ``vertical``.
* **handlePosition** (*String*, optional): Position for the handle that expands/collapses the div. Available options are ``left``, ``right``, ``top``, ``bottom``, ``top-left``, ``bottom-left``, ``top-right``, ``bottom-right``. Default is ``bottom``.
* **visible** (*boolean*, optional): Determines whether to show or hide the div when created. Default is ``false``.

Example:
```js
ui.create("sliding-div", {
    id : "mysliding",
    parent : "layout-center",
    css : "sliding-div",
    direction : "both",
    handlePosition : "bottom-right",
    visible : true
});
```

### <a name="ui-table"></a>table

Extra `props`:

* **label** (*String*, optional): Label to show before the text area field.
* **rows** (*int*, optional): Number of rows for the text area.
* **cols** (*int*, optional): Number of columns for the text area.
* **hasColumnSelection** (*boolean*, optional): Enable to show a button above the table that allows dynamic column selection. Default is ``false``.
* **messages** (*Object*, optional): Translation messages for the table. Currently supports the following messages:

  * **info**: Specifies which page and/or rows are being shown among the total. It's possible to use the following placeholders: ``_PAGE_``, ``_PAGES_``, ``_START_``, ``_END_``, ``_TOTAL_``.

Example:
```js
ui.create("table", {
    id : "mytable",
    parent : "layout-center"
    css : "table-class",
    messages : {
        "info" : "Showing records from _START_ to _END_. Total: _TOTAL_."
    }
});
```

### <a name="ui-text-area-field"></a>text-area

Extra `props`:

* **label** (*String*, optional): Label to show before the text area field.
* **rows** (*int*, optional): Number of rows for the text area.
* **cols** (*int*, optional): Number of columns for the text area.

Example:
```js
ui.create("text-area", {
    id : "mytextarea",
    parent : "mydialog",
    css : "text-area",
    rows : 2,
    cols : 40
});
```


## Extended functionality

### ui-accordion-group:`<id>`:visibility

`<group-id>` matches the *id* specified when creating the [accordion group](#ui-accordion-group).

Message (*Object*):

* **header** (*boolean*, optional): Determines wether the header of the group should be visible or not. If not specified, the visibility is not changed.
* **content** (*boolean*, optional): Determines wether the content of the group should be visible or not. If not specified, the visibility is not changed.

Example:
```js
bus.send("ui-accordion-group:layers:visibility", {
    header : true,
    content : false
});
```

###<a name="ui-autocomplete-set-values"></a>ui-autocomplete:`<id>`:set-values

`<id>` matches the *div* specified when creating the [autocomplete](#ui-autocomplete).

Message (*Array* of *String*): Values to set for autocompletion.

Example:
```js
bus.send("ui-autocomplete:myautocomplete:set-values", [ [ "1", "2", "3" ] ]);
```

### ui-autocomplete:`<id>`:selected

`<id>` matches the *div* specified when creating the [autocomplete](#ui-autocomplete-create).

Message (*String*): Selected value from the *options* array specified when setting the [values](#ui-autocomplete-set-values).

Example:
```js
bus.send("ui-autocomplete:myautocomplete:selected", "One");
```

### ui-autocomplete:`<id>`:set-label

`<id>` matches the *div* specified when creating the [autocomplete](#ui-autocomplete-create).

Message (*String*): Label text.

Example:
```js
bus.send("ui-autocomplete:myautocomplete:set-label", "Autocomplete: ");
```

### ui-button:`<id>`:enable

`<id>` matches the *div* specified when creating the [button](#ui-button).

Message (*boolean*, mandatory): Determines whether the button should be enabled or not.

Example:
```js
bus.send("ui-button:mybutton:enable", true);
```

### ui-button:`<id>`:activate

`<id>` matches the *div* specified when creating the [button](#ui-button).

Message (*boolean*, mandatory): Determines whether the button should be active or not.

Example:
```
bus.send("ui-button:mybutton:activate", true);
```

### ui-button:`<id>`:toggle

`<id>` matches the *div* specified when creating the [button](#ui-button).

Message (*Empty*).

Example:
```js
bus.send("ui-button:mybutton:toggle");
```

### ui-button:`<id>`:link-active

`<id>` matches the *div* specified when creating the [button](#ui-button).

Message (*String*, mandatory): Identifier of the div to link active state. Button state will change on [ui-show](#ui-show), [ui-hide](#ui-hide) and [ui-toggle](#ui-toggle) events for this div.

Example:
```js
bus.send("ui-button:mybutton:link-active", "mydialog");
```


### ui-choice-field:`<id>`:set-values

`<id>` matches the *div* specified when creating the [choice field](#ui-choice-field).

Message (*Array* of *String*): Values to set.

Example:
```js
bus.send("ui-choice-field:mychoice:set-values", [ [ "1", "2", "3" ] ]);
```

### ui-choice-field:`<id>`:set-label

`<id>` matches the *div* specified when creating the [choice field](#ui-choice-field).

Message (*String*): Label text.

Example:
```js
bus.send("ui-choice-field:mychoice:set-label", "Choice: ");
```

### <a name="ui-dropdown-button-add-item"></a>ui-dropdown-button:`<id>`:add-item

`<id>` matches the *div* specified when creating the [dropdown button](#ui-dropdown-button).

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

### ui-dropdown-button:`<id>`:set-item

`<id>` matches the *div* specified when creating the [dropdown button](#ui-dropdown-button).

Message (*String*, mandatory): Identifier of the item to set, as specified on [ui-dropdown-button:&lt;id&gt;:add-item](#ui-dropdown-button-add-item).

Example:
```js
bus.send("ui-dropdown-button:mydropdown:set-item", "item1");
```

### ui-dropdown-button:`<id>`:item-selected

`<id>` matches the *div* specified when creating the [dropdown button](#ui-dropdown-button).

Message (*String*, mandatory): Identifier of the item that has been selected, as specified on [ui-dropdown-button:&lt;id&gt;:add-item](#ui-dropdown-button-add-item).

Example:
```js
bus.send("ui-dropdown-button:mydropdown:item-selected", "item1");
```


### ui-form-collector:extend

With this event you can gather data from a set of input controls and send an event with that data.

Message (*Object*):

* **button** (*String*, mandatory): Identifier of the button that will trigger the form collection and event send.
* **clickEventName** (*String*, mandatory): Event to send when the button is clicked.
* **divs** (*Array* of *String*, mandatory): Set of divs to gather data. These fields must implement the `<field>-field-value-fill`_ event.
* **requiredDivs** (*Array* of *String*, optional): Subset of ``divs``. All these fields must have non empty values for the ``button`` to be enabled, otherwise it's disabled. Works for fields created with the ``ui-input-field:create`` and ``ui-choice-field:create`` events.
* **names** (*Array* of *String*, optional): Set of attribute names to use for the event message. If not specified, the div identifiers will be used as attribute names for event message.

Example:
```js
bus.send("ui-form-collector:extend", {
    button : "button-ok",
    clickEventName : "zoomTo",
    divs : [ "input-crs", "input-x", "input-y" ],
    names : [ "crs", "lon", "lat" ]
});
```

### ui-slider:`<id>`:set-label

`<id>` matches the *id* specified when creating the [slider](#ui-slider).

Message (*String*): Label text.

Example:
```js
bus.send("ui-slider:myslider:set-label", "Slider: "]);
```

### ui-slider:`<id>`:set-value

`<id>` matches the *id* specified when creating the [slider](#ui-slider).

Message (*int*): Value to select.

Example:
```js
bus.send("ui-slider:myslider:set-value", 4);
```

### ui-slider:`<id>`:set-values

`<id>` matches the *id* specified when creating the [slider](#ui-slider).

Message (*Array* of *int*): Values to set.

Example:
```js
bus.send("ui-slider:myslider:set-values", [ [ 1, 4, 6 ] ]);
```

### ui-input-field:`<id>`:set-label

`<id>` matches the *id* specified when creating the [input field](#ui-input-field).

Message (*String*): Label text.

Example:
```js
bus.send("ui-input-field:myinput:set-label", "Input: ");
```

### ui-sliding-div:expand

Message (*String*, mandatory): Id of the sliding div to expand.

Example:
```js
bus.send("ui-sliding-div:expand", "mysliding");
```

### ui-sliding-div:collapse

Message (*String*, mandatory): Id of the sliding div to collapse.

Example:
```js
bus.send("ui-sliding-div:collapse", "mysliding");
```

### ui-sliding-div:toggle

Message (*String*, mandatory): Id of the sliding div to toggle.

Example:
```js
bus.send("ui-sliding-div:toggle", "mysliding");
```


### ui-table:`<id>`:clear

`<id>` matches the *div* specified when creating the [table](#ui-table).

Message (*Empty*).

Example:
```js
bus.send("ui-table:mytable:clear");
```

### ui-table:`<id>`:adjust

Used to adjust the column width, usually when the table is shown. `<id>` matches the *div* specified when creating the [table](#ui-table).

Message (*Empty*).

Example:
```js
bus.send("ui-table:mytable:adjust");
```

### <a name="ui-table-set-data"></a>ui-table:`<id>`:set-data

`<id>` matches the *div* specified when creating the [table](#ui-table).

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

### ui-table:`<id>`:data-selected

`<id>` matches the *div* specified when creating the [table](#ui-table).

Message (*Array* of *Object*): Array with the selected objects (subset of the array provided on [ui-table:&lt;id&gt;:set-data](#ui-table-set-data)). All objects should in the array should have the same properties.

Example:
```js
bus.send("ui-table:mytable:data-selected", [[{
    "number" : "3",
    "char" : "c"
}]]);
```

### ui-table:`<id>`:select-data

`<id>` matches the *div* specified when creating the [table](#ui-table).

Message (*Array* of *Object*): Array with the selected objects (subset of the array provided on [ui-table:&lt;id&gt;:set-data](#ui-table-set-data)). All objects should in the array should have the same properties.

Example:
```js
bus.send("ui-table:mytable:select-data", [[{
    "number" : "3",
    "char" : "c"
}]]);
```

### ui-table:`<id>`:invert-selection

`<id>` matches the *div* specified when creating the [table](#ui-table).

Message: Empty.

Example:
```js
bus.send("ui-table:mytable:invert-selection");
```

### ui-table:`<id>`:sort-selected-first

`<id>` matches the *div* specified when creating the [table](#ui-table).

Message: Empty.

Example:
```js
bus.send("ui-table:mytable:sort-selected-first");
```

### ui-table:`<id>`:filter

`<id>` matches the *div* specified when creating the [table](#ui-table).

Message (*String*): Text to filter the rows on the table.

Example:
```js
bus.send("ui-table:mytable:filter", "Male");
```

### ui-table:`<id>`:row-selection-changed

`<id>` matches the *div* specified when creating the [table](#ui-table).

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

### ui-table:`<id>`:column-visibility-changed

`<id>` matches the *div* specified when creating the [table](#ui-table).

Message (*Array* of *int*, mandatory): Array containing the indexes of the currently visible columns.

Example:
```js
bus.send("ui-table:mytable:column-visibility-changed", [[ 1, 2, 4, 7 ]]);
```


### ui-text-area-field:`<id>`:set-label

`<id>` matches the *div* specified when creating the [text area field](#ui-text-area-field).

Message (*String*): Label text.

Example:
```js
bus.send("ui-text-area-field:mytext:set-label", "Text: ");
```
