define([ "jquery", "message-bus", "module", //
"./accordion-group", "./alerts", "./buttons", "./checkbox", "./choice", //
"./commons", "./confirm-dialog", "./dialog", "./divstack", // 
"./dropdown-buttons", "./form-collector", "./input", "./loading", "./radio", // 
"./slider", "./sliding-div", "./table", "./text-area", "sortable", "tipsy" ],// 
function($, bus, module, //
accordionGroup, alerts, buttons, checkbox, choice, //
commons, confirmDialog, dialog, divstack,//
dropdownButtons, formCollector, input, loading, radio, //
slider, slidingDiv, table, textArea, Sortable) {
  var TOOLTIP_ATTR = "geoladris-ui-tooltip";
  var TOOLTIP_GRAVITIES = {
    "left" : "e",
    "right" : "w",
    "top" : "s",
    "bottom" : "n",
    "top-left" : "se",
    "top-right" : "sw",
    "bottom-left" : "ne",
    "bottom-right" : "nw"
  };

  bus.listen("ui-show", function(e, id) {
    document.getElementById(id).style.display = "";
  });

  bus.listen("ui-hide", function(e, id) {
    document.getElementById(id).style.display = "none";
  });

  bus.listen("ui-toggle", function(e, id) {
    var e = document.getElementById(id);
    e.style.display = e.style.display == "none" ? "" : "none";
  });

  bus.listen("ui-open-url", function(e, msg) {
    window.open(msg.url, msg.target);
  });

  bus.listen("modules-loaded", function() {
    bus.send("ui-loaded");
  });

  return {
    create : function(type, props) {
      // Do not create if already exists
      var e = document.getElementById(props.id);
      if (e) {
        return e;
      }

      switch (type) {
      case "accordion-group":
        e = accordionGroup(props);
        break;
      case "autocomplete":
        e = autocomplete(props);
        break;
      case "button":
        e = buttons(props);
        break;
      case "checkbox":
        e = checkbox(props);
        break;
      case "choice":
        e = choice(props);
        break;
      case "confirm-dialog":
        e = confirmDialog(props);
        break;
      case "dialog":
        e = dialog(props);
        break;
      case "divstack":
        e = divstack(props);
        break;
      case "dropdown-button":
        e = dropdownButtons(props);
        break;
      case "input":
        e = input(props);
        break;
      case "radio":
        e = radio(props);
        break;
      case "slider":
        e = slider(props);
        break;
      case "sliding-div":
        e = slidingDiv(props);
        break;
      case "table":
        e = table(props);
        break;
      case "text-area":
        e = textArea(props);
        break;
      default:
        e = commons.getOrCreateElem(type, props);
        break;
      }

      if (e) {
        bus.send("ui:created", e);
      }
      return e;
    },
    tooltip : function(elem, props) {
      if (typeof elem == "string") {
        elem = document.getElementById(elem);
      }

      elem.setAttribute(TOOLTIP_ATTR, props.text);
      var jelem = $(elem);
      jelem.tipsy({
        trigger : "manual",
        title : TOOLTIP_ATTR,
        html : true,
        opacity : 1,
        gravity : TOOLTIP_GRAVITIES[props.location] || $.fn.tipsy.autoNS
      });
      jelem.tipsy("show");

      return jelem.data("tipsy").$tip[0];
    },
    sortable : function(elem) {
      if (typeof elem == "string") {
        elem = document.getElementById(elem);
      }

      Sortable.create(elem, {
        onSort : function() {
          var event = document.createEvent('Event');
          event.initEvent('change', true, true);
          elem.dispatchEvent(event);
        }
      });
    }
  }
});
