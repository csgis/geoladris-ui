**Note**: Any module not listed here does not use any configuration.

# ui

## `ui.js`

It provides the following functions:

### `create(type, properties)`

UI creation is managed with a single function instead of a set of events. The function accepts the following arguments:

* **type** (*String*, mandatory): The type of element to create. There are some special element types with added functionality/elements (see list below); apart from that, any valid HTML tag (`div`, `a`, `p`) is a valid type.

  When a special element type matches a valid HTML tag (`input`, `table`, ...), the element is always created with added functionality/elements.

* **props** (*Object*, mandatory): Properties to create the element. The following properties are available for all element types (except when specified); special element types have special properties (see below):

  * **id** (*String*, mandatory): `id` attribute for the created element.
  * **parent** (*String* or *DOM Element*, mandatory): parent element (`id` attribute or DOM element) where the new element should be added.
  * **css** (*String*, optional): CSS class(es) to apply to the new element.
  * **html** (*String*, optional): HTML (inner) content to set for the new element.
  * **priority** (*int*, optional): Element's priority. If priority is specified, the button will be added at the corresponding index to the parent div, depending on the priorities of the other elements. If priority is not specified, the button will be added at the end.

Whenever an element is created, a new event is sent with the DOM element:

```js
bus.send("ui:created", elem);
```


#### <a name="ui-accordion-group"></a>accordion-group

Extra `props`:

* **title** (*String*, mandatory): Text to show in the group header.
* **visible** (*boolean*): Determines wether the content should be visible or not; this is, wether the accordion group should be collapsed or not. Default is *false*.

Returns an object with two DOM elements:
* **header**
* **content**

Example:
```js
var accordionGroup = ui.create("accordion-group", {
    id : "layers",
    parent : "parent",
    title : "My Layers",
    visible : true
});
accordionGroup.header.style.color = "white";
accordionGroup.content.style.color = "black";
```

#### <a name="ui-button"></a>button

Extra `props`:

* **tooltip** (*String*, optional): Tooltip to show on mouse over.
* **text** (*String*, **text** or **image** mandatory): The text to show in the button.
* **image** (*String*, **text** or **image** mandatory): The image to show in the button background.
* **clickEventName** (*String*, optional): Name of the event to send when the button is clicked.
* **clickEventMessage** (*any*, optional): The message to send when the button is clicked. It is ignored if *clickEventName* is not specified.
* **clickEventCallback** (*function*, optional): The callback to call when the button is clicked. It is ignored if *clickEventName* is also specified.

Returns the button (DOM element).

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

#### <a name="ui-checkbox"></a>checkbox

Extra `props`:

* **label** (*String*, mandatory): Text to show for the new item.

Returns the input (DOM element).

Example:
```js
ui.create("checkbox", {
    id : "osm",
    parent : "layer-list",
    css : "layerlist",
    label : "OSM"
});
```

#### <a name="ui-choice"></a>choice

Extra `props`:

* **label** (*String*, optional): Label to show before the choice field.
* **values** (*Array* of *string* or *Object*, optional): Available values for the choice field. If objects are provided, each object must have ``value`` (the field value itself) and ``text`` (the display text for the value); if strings are provided, each string is used for both value and text.

Returns the input (DOM element).

Example:
```js
ui.create("choice", {
    id : "mychoice",
    parent : "mydialog",
    css : "choice",
    label : "Number: ",
    values : [ {
        value : "value-1",
        text : "1"
    }, {
        value : "value-2",
        text : "2"
    }, {
        value : "value-3",
        text : "3"
    } ]
});
```


#### <a name="ui-confirm-dialog"></a>confirm-dialog

Extra `props`:

* **messages** (*Object*):
    * **question**: Question to be confirmed or not. Optional.
    * **yes**: Text for the *ok* button.
    * **no**: Text for the *cancel* button.
* Any other property that can be accepted by [dialog](#ui-dialog).

Returns the dialog (DOM element).

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

#### <a name="ui-dialog"></a>dialog

Extra `props`:

* **title** (*String*, optional): Dialog title.
* **closeButton** (*boolean*): Determines wether the dialog has a close button or not.
* **modal** (*boolean*): Determines if the dialog is modal or not.
* **visible** (*boolean*): Determines wether the dialog should be shown when created or not.

Returns the dialog (DOM element).

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

#### <a name="ui-divstack"></a>divstack

In this case `props` must be an array of div identifiers. These divs will be mutually exclusive; if a div is shown all the others will be hidden. This event does **not** create the divs.

Returns `undefined`.

Example:
```js
ui.create("divstack", ["mydiv", "mydiv2", "mydiv3"]);
```

#### <a name="ui-dropdown-button"></a>dropdown-button

Same extra `props` as `button`s. Useful for `ui-dropdown-buttons:<id>:*` events.

Returns the button (DOM element).

Example:
```js
ui.create("dropdown-button", {
    id : "mydropdown",
    parent : "layout-center",
    tooltip : "Dropdown button"
});
```

#### <a name="ui-input"></a>input

Extra `props`:

* **label** (*String*, optional): Label to show before the input field.
* **type** (*String*, optional): Type of input. It must be one of the values supported by the `<input>` tag for the `type` attribute. Default is `text`.
* **placeholder** (*String*, optional): Placeholder to show in the input.
* **autocomplete** (*Function*): Enables autocompletion. Used only if `type` is `text`.

  Receives:
  * **query** (*String*): Current value of the input to autocomplete.

  Returns an *Array* of *Object*. Each object has:
  * **value** (*String*, mandatory): Text to show in the autocomplete suggestion.
  * **type** (*String*, optional): CSS class to set in the element containing the suggestion, to style it differently.

The following properties are only available if `options` have been specified:

* **minQueryLength** (*int*, optional): Minimum number of characters that have to be written before the autocomplete options appear. Default value is 0.
* **showOnFocus** (*boolean*): Determines whether the autocomplete options will be shown when the control gains focus or not. Note that if the current text is shorter than *minQueryLength*, options won't be shown even if this option is `true`.

Returns the input (DOM element).

Example:
```js
ui.create("input", {
    id : "login-user",
    parent : "mydialog",
    css : "login-field",
    label : "User: ",
    type : "text"
    placeholder : "Enter your user",
    autocomplete : function(query) {
      return [ "User 1", "User 2", "User 3" ].filter(function(u) {
        return u.startsWith(query);
      });
    },
    minQueryLength : 3,
    showOnFocus : true
});
```

#### <a name="ui-radio"></a>radio

Extra `props`:

* **label** (*String*, mandatory): Text to show for the new item.

Returns the input (DOM element).

Example:
```js
ui.create("radio", {
    id : "osm",
    parent : "base-layer",
    css : "baselayer",
    label : "OpenStreetMap"
});
```

#### <a name="ui-slider"></a>slider

Extra `props`:

* **label** (*String*, optional): Label to show before the choice field.
* **values** (*Array* of *int*, mandatory): Available values for the slider.
* **value** (*int*, optional): Initial value for the slider. It must be contained in **values**.
* **snap** (*boolean*, optional): Snap to **values** or not. Default is `false`.

Returns the slider (DOM element). It listens to the `change` and `slide` events. Both return the selected value in `event.detail.value`.

Example:
```js
var slider = ui.create("slider", {
    id : "myslider",
    parent : "mydialog",
    css : "slider",
    label : "Number: ",
    values : [ 1, 2, 3 ],
    value : 2,
    snap : true
});

slider.addEventListener("change", function(event) {
    console.log("Changed: " + event.detail.value);
});

slider.addEventListener("slide", function(event) {
    console.log("Slided: " + event.detail.value);
});
```

#### sliding-div

Extra `props`:

* **direction** (*String*, optional): Sliding direction. Available options are ``horizontal``, ``vertical`` and ``both``. Default is ``vertical``.
* **handlePosition** (*String*, optional): Position for the handle that expands/collapses the div. Available options are ``left``, ``right``, ``top``, ``bottom``, ``top-left``, ``bottom-left``, ``top-right``, ``bottom-right``. Default is ``bottom``.
* **visible** (*boolean*, optional): Determines whether to show or hide the div when created. Default is ``false``.

Returns the sliding div (DOM element).

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

#### <a name="ui-table"></a>table-ext

A table with very specific functionality. It has the `-ext` suffix so it is possible to create a standard `<table>` tag without this functionality.

Extra `props`:

* **label** (*String*, optional): Label to show before the text area field.
* **rows** (*int*, optional): Number of rows for the text area.
* **cols** (*int*, optional): Number of columns for the text area.
* **hasColumnSelection** (*boolean*, optional): Enable to show a button above the table that allows dynamic column selection. Default is ``false``.
* **messages** (*Object*, optional): Translation messages for the table. Currently supports the following messages:

  * **info**: Specifies which page and/or rows are being shown among the total. It's possible to use the following placeholders: ``_PAGE_``, ``_PAGES_``, ``_START_``, ``_END_``, ``_TOTAL_``.

Returns the table (DOM element).

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

#### <a name="ui-text-area"></a>text-area

Extra `props`:

* **label** (*String*, optional): Label to show before the text area field.
* **rows** (*int*, optional): Number of rows for the text area.
* **cols** (*int*, optional): Number of columns for the text area.

Returns the textarea (DOM element).

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

#### `sortable(elem)`

Makes sortable the children of the specified element.
  * **param `elem`**: `id` (string) or DOM element (Element).
  * **returns**: `undefined`.
  * **event `change`**: enabled for the specified element; triggered whenever the order changes. This shouldn't interfere with the `change` event since no `input`, `select`, `textarea` (according to to the [MDN doc](https://developer.mozilla.org/en-US/docs/Web/Events/change), the only Elements triggering `change`) should ever be sortable.


### `ui-alerts.js`

* **timeout** (*int*, optional): Number of seconds before the alert disappears. Default is 5.
* **parentDiv** (*String*, optional): Identifier of the div where the alerts should be added. Defaults to ``layout.center``.

### `ui-sliding-div.js`

* **duration** (*int*, optional): Number of milliseconds for the sliding div animation. Default is 500.
