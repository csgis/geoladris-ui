define([ "jquery", "message-bus", "./commons" ], function($, bus, commons) {
  function visibility(id, visible) {
    if (visible !== undefined) {
      if (visible) {
        bus.send("ui-show", id);
      } else {
        bus.send("ui-hide", id);
      }
    }
  }

  return function(props) {
    var containerCss = "";
    var headerCss = "";
    if (props.css) {
      var classes = props.css.split("\s+");
      containerCss = classes.map(function(a) {
        return a + "-container";
      }).join(" ");
      headerCss = classes.map(function(a) {
        return a + "-header";
      }).join(" ");
    }
    var container = commons.getOrCreateElem("div", {
      id : props.id + "-container",
      parent : props.parent,
      css : containerCss
    });

    var header = commons.getOrCreateElem("div", {
      id : props.id + "-header",
      parent : container,
      css : headerCss + " accordion-header"
    });
    var headerText = commons.getOrCreateElem("p", {
      parent : header,
      html : props.title,
      css : "accordion-header-text"
    });
    var content = commons.getOrCreateElem("div", {
      id : props.id,
      parent : container,
      css : (props.css || "") + " accordion-content"
    });

    header.addEventListener("click", function() {
      $(content).slideToggle({
        duration : 300
      });
    });

    content.style.display = props.visible ? "block" : "none";

    bus.listen("ui-accordion-group:" + props.id + ":visibility", function(e, msg) {
      visibility(props.id + "-header", msg.header);
      visibility(props.id, msg.content);
    });

    return {
      header : header,
      content : content
    };
  };
});
