define([ "jquery", "message-bus" ], function($, bus) {
  function getOrCreateElem(type, props) {
    var elem = $("#" + props.id);
    if (elem.length === 0) {
      elem = $("<" + type + "/>").attr("id", props.id);
      elem.addClass(props.css);

      if (props.parent) {
        var parent;
        if (typeof props.parent == "string") {
          parent = $("#" + props.parent);
        } else {
          // If not an id, assume a DOM node
          parent = $(props.parent);
        }
        append(elem, parent, props.priority);
      }
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

  function createLabel(id, parent, text) {
    var label = getOrCreateElem("label", {
      id : id + "-label",
      parent : parent,
      html : text,
      css : "ui-label"
    });
    if (!text) {
      label.hide();
    }

    bus.listen("ui-input:" + id + ":set-label", function(e, labelText) {
      if (labelText) {
        label.text(labelText);
        label.show();
      } else {
        label.hide();
      }
    });

    return label;
  }

  function createContainer(id, parent, css) {
    var containerCss = "";
    if (css) {
      containerCss = css.split("\s+").map(function(a) {
        return a + "-container";
      }).join(" ");
    }
    return getOrCreateElem("div", {
      id : id + "-container",
      parent : parent,
      css : containerCss + " ui-input-container"
    })[0];
  }

  return {
    getOrCreateElem : getOrCreateElem,
    append : append,
    createLabel : createLabel,
    createContainer : createContainer
  };
});