define([ "message-bus", "./commons" ], function(bus, commons) {
  var zIndex;

  function showOnTop(container) {
    container.style.display = "";
    var i = parseInt(container.style.zIndex);
    if (!zIndex) {
      zIndex = i + 1;
    } else {
      container.style.zIndex = zIndex++;
    }
  }

  return function(props) {
    var container = commons.getOrCreateElem("div", {
      id : props.id + "-dialog-container",
      parent : props.parent,
      css : "dialog-container"
    });

    if (props.modal) {
      container.className += " dialog-modal";
    }

    var div = commons.getOrCreateElem("div", {
      id : props.id,
      parent : container,
      css : "dialog " + (props.css || "")
    });

    bus.listen("ui-show", function(e, id) {
      if (id == props.id) {
        showOnTop(container);
      }
    });
    bus.listen("ui-hide", function(e, id) {
      if (id == props.id) {
        container.style.display = "none";
      }
    });
    bus.listen("ui-toggle", function(e, id) {
      if (id == props.id) {
        if (container.style.display == "none") {
          showOnTop(container);
        } else {
          container.style.display = "none";
        }
      }
    });

    var title = commons.getOrCreateElem("div", {
      parent : div,
      css : "dialog-title",
      html : props.title
    });

    var dragging = false;
    var startX, startY;
    var startOffsetTop;
    var startOffsetLeft;

    var originalCursor = title.style["cursor"];
    title.addEventListener("mousedown", function(event) {
      title.style["cursor"] = "move";
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      startOffsetTop = div.offsetTop;
      startOffsetLeft = div.offsetLeft;
    });
    title.addEventListener("mouseup", function(event) {
      dragging = false;
      title.style["cursor"] = "originalCursor";
    });

    window.addEventListener("mousemove", function(event) {
      if (!dragging) {
        return;
      }

      div.style["position"] = "fixed";
      div.style["top"] = startOffsetTop + (event.clientY - startY) + "px";
      div.style["left"] = startOffsetLeft + (event.clientX - startX) + "px";
      div.style["right"] = "unset";
      div.style["bottom"] = "unset";
    });

    if (props.closeButton) {
      var close = commons.getOrCreateElem("div", {
        parent : div,
        css : "dialog-close"
      });
      close.addEventListener("click", function() {
        bus.send("ui-hide", props.id);
      });
    }

    if (props.visible) {
      bus.send("ui-show", props.id);
    } else {
      bus.send("ui-hide", props.id);
    }

    return div;
  };
});
