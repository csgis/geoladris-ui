define([ "message-bus" ], function(bus) {
  function getOrCreateElem(type, props) {
    var elem;
    if (props.id) {
      elem = document.getElementById(props.id);
    }

    if (!elem) {
      elem = document.createElement(type);

      if (props.id) {
        elem.id = props.id;
      }

      elem.className = props.css || "";

      if (props.parent) {
        var parent = props.parent;
        if (typeof parent == "string") {
          parent = document.getElementById(parent);
        }
        if (parent) {
          append(elem, parent, props.priority);
        }
      }
    }

    if (props.html) {
      elem.innerHTML = props.html;
    }

    return elem;
  }

  function append(elem, parent, priority) {
    var nextElem;

    if (priority) {
      elem.priority = priority;

      for (var i = 0; i < parent.children.length; i++) {
        var child = parent.children[i];
        var p = child.priority;
        if (!p || p > priority) {
          nextElem = child;
          break;
        }
      }
    }

    if (nextElem) {
      parent.insertBefore(elem, nextElem);
    } else {
      parent.appendChild(elem);
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
      label.style.display = "none";
    }

    bus.listen("ui-input:" + id + ":set-label", function(e, labelText) {
      if (labelText) {
        label.innerHTML = labelText;
        label.style.display = "block";
      } else {
        label.style.display = "none";
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
    });
  }

  return {
    getOrCreateElem : getOrCreateElem,
    append : append,
    createLabel : createLabel,
    createContainer : createContainer
  };
});