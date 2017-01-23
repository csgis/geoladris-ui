**Note**: Any module not listed here does not use any configuration.

## ui

### `ui.js`

It provides the following functions:

#### `create(type, properties)`

See [ref](events.md#ui-creation).


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
