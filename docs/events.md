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

## Extended functionality

### ui-accordion-group:`<id>`:visibility

`<group-id>` matches the *id* specified when creating the [accordion group](plugins.md#ui-accordion-group).

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

### ui-button:`<id>`:enable

`<id>` matches the *id* specified when creating the [button](plugins.md#ui-button).

Message (*boolean*, mandatory): Determines whether the button should be enabled or not.

Example:
```js
bus.send("ui-button:mybutton:enable", true);
```

### ui-button:`<id>`:activate

`<id>` matches the *id* specified when creating the [button](plugins.md#ui-button).

Message (*boolean*, mandatory): Determines whether the button should be active or not.

Example:
```
bus.send("ui-button:mybutton:activate", true);
```

### ui-button:`<id>`:toggle

`<id>` matches the *id* specified when creating the [button](plugins.md#ui-button).

Message (*Empty*).

Example:
```js
bus.send("ui-button:mybutton:toggle");
```

### ui-button:`<id>`:link-active

`<id>` matches the *id* specified when creating the [button](plugins.md#ui-button).

Message (*String*, mandatory): Identifier of the div to link active state. Button state will change on [ui-show](#ui-show), [ui-hide](#ui-hide) and [ui-toggle](#ui-toggle) events for this div.

Example:
```js
bus.send("ui-button:mybutton:link-active", "mydialog");
```


### ui-choice:`<id>`:set-values

`<id>` matches the *id* specified when creating the [choice](plugins.md#ui-choice).

Message (*Array* of *String*): Values to set.

Example:
```js
bus.send("ui-choice:mychoice:set-values", [ [ "1", "2", "3" ] ]);
```

### <a name="ui-dropdown-button-add-item"></a>ui-dropdown-button:`<id>`:add-item

`<id>` matches the *id* specified when creating the [dropdown button](plugins.md#ui-dropdown-button).

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

`<id>` matches the *id* specified when creating the [dropdown button](plugins.md#ui-dropdown-button).

Message (*String*, mandatory): Identifier of the item to set, as specified on [ui-dropdown-button:&lt;id&gt;:add-item](plugins.md#ui-dropdown-button-add-item).

Example:
```js
bus.send("ui-dropdown-button:mydropdown:set-item", "item1");
```

### ui-dropdown-button:`<id>`:item-selected

`<id>` matches the *id* specified when creating the [dropdown button](plugins.md#ui-dropdown-button).

Message (*String*, mandatory): Identifier of the item that has been selected, as specified on [ui-dropdown-button:&lt;id&gt;:add-item](plugins.md#ui-dropdown-button-add-item).

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
* **requiredDivs** (*Array* of *String*, optional): Subset of ``divs``. All these fields must have non empty values for the ``button`` to be enabled, otherwise it's disabled. Works for fields created with the ``ui-input:create`` and ``ui-choice:create`` events.
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

### ui-input:`<id>`:set-label

`<id>` matches the *id* specified when creating the input (can be [checkbox](plugins.md#ui-checkbox), [choice](plugins.md#ui-choice), [input](plugins.md#ui-input), [radio](plugins.md#ui-radio),  [slider](plugins.md#ui-slider) or [text-area](plugins.md#ui-text-area)).

Message (*String*): Label text.

Example:
```js
bus.send("ui-input:mychoice:set-label", "Choice: ");
```

###<a name="ui-input-set-values"></a>ui-input:`<id>`:set-values

`<id>` matches the *id* specified when creating the [input](plugins.md#ui-input).

Message (*Array* of *String*): Values to set for autocompletion.

Example:
```js
bus.send("ui-input:myautocomplete:set-values", [ [ "1", "2", "3" ] ]);
```

### ui-slider:`<id>`:set-value

`<id>` matches the *id* specified when creating the [slider](plugins.md#ui-slider).

Message (*int*): Value to select.

Example:
```js
bus.send("ui-slider:myslider:set-value", 4);
```

### ui-slider:`<id>`:set-values

`<id>` matches the *id* specified when creating the [slider](plugins.md#ui-slider).

Message (*Array* of *int*): Values to set.

Example:
```js
bus.send("ui-slider:myslider:set-values", [ [ 1, 4, 6 ] ]);
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

`<id>` matches the *id* specified when creating the [table](plugins.md#ui-table).

Message (*Empty*).

Example:
```js
bus.send("ui-table:mytable:clear");
```

### ui-table:`<id>`:adjust

Used to adjust the column width, usually when the table is shown. `<id>` matches the *id* specified when creating the [table](plugins.md#ui-table).

Message (*Empty*).

Example:
```js
bus.send("ui-table:mytable:adjust");
```

### <a name="ui-table-set-data"></a>ui-table:`<id>`:set-data

`<id>` matches the *id* specified when creating the [table](plugins.md#ui-table).

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

`<id>` matches the *id* specified when creating the [table](plugins.md#ui-table).

Message (*Array* of *Object*): Array with the selected objects (subset of the array provided on [ui-table:&lt;id&gt;:set-data](plugins.md#ui-table-set-data)). All objects should in the array should have the same properties.

Example:
```js
bus.send("ui-table:mytable:data-selected", [[{
    "number" : "3",
    "char" : "c"
}]]);
```

### ui-table:`<id>`:select-data

`<id>` matches the *id* specified when creating the [table](plugins.md#ui-table).

Message (*Array* of *Object*): Array with the selected objects (subset of the array provided on [ui-table:&lt;id&gt;:set-data](plugins.md#ui-table-set-data)). All objects should in the array should have the same properties.

Example:
```js
bus.send("ui-table:mytable:select-data", [[{
    "number" : "3",
    "char" : "c"
}]]);
```

### ui-table:`<id>`:invert-selection

`<id>` matches the *id* specified when creating the [table](plugins.md#ui-table).

Message: Empty.

Example:
```js
bus.send("ui-table:mytable:invert-selection");
```

### ui-table:`<id>`:sort-selected-first

`<id>` matches the *id* specified when creating the [table](plugins.md#ui-table).

Message: Empty.

Example:
```js
bus.send("ui-table:mytable:sort-selected-first");
```

### ui-table:`<id>`:filter

`<id>` matches the *id* specified when creating the [table](plugins.md#ui-table).

Message (*String*): Text to filter the rows on the table.

Example:
```js
bus.send("ui-table:mytable:filter", "Male");
```

### ui-table:`<id>`:row-selection-changed

`<id>` matches the *id* specified when creating the [table](plugins.md#ui-table).

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

`<id>` matches the *id* specified when creating the [table](plugins.md#ui-table).

Message (*Array* of *int*, mandatory): Array containing the indexes of the currently visible columns.

Example:
```js
bus.send("ui-table:mytable:column-visibility-changed", [[ 1, 2, 4, 7 ]]);
```
