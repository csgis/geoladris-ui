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
    $("#" + id).show();
  });

  bus.listen("ui-hide", function(e, id) {
    $("#" + id).hide();
  });

  bus.listen("ui-toggle", function(e, id) {
    $("#" + id).toggle();
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
      var jqueryElem = $("#" + props.id);
      if (jqueryElem.length > 0) {
        return jqueryElem.get(0);
      }

      switch (type) {
      case "accordion-group":
        jqueryElem = accordionGroup(props);
        break;
      case "autocomplete":
        jqueryElem = autocomplete(props);
        break;
      case "button":
        jqueryElem = buttons(props);
        break;
      case "checkbox":
        jqueryElem = checkbox(props);
        break;
      case "choice":
        jqueryElem = choice(props);
        break;
      case "confirm-dialog":
        jqueryElem = confirmDialog(props);
        break;
      case "dialog":
        jqueryElem = dialog(props);
        break;
      case "divstack":
        jqueryElem = divstack(props);
        break;
      case "dropdown-button":
        jqueryElem = dropdownButtons(props);
        break;
      case "input":
        jqueryElem = input(props);
        break;
      case "radio":
        jqueryElem = radio(props);
        break;
      case "slider":
        jqueryElem = slider(props);
        break;
      case "sliding-div":
        jqueryElem = slidingDiv(props);
        break;
      case "table":
        jqueryElem = table(props);
        break;
      case "text-area":
        jqueryElem = textArea(props);
        break;
      default:
        jqueryElem = commons.getOrCreateElem(type, props);
        break;
      }

      if (jqueryElem) {
        var elem = jqueryElem.get(0);
        bus.send("ui:created", elem);
        return elem;
      }
    },
    tooltip : function(elem, props) {
      if (typeof elem == "string") {
        elem = document.getElementById(elem);
      }
      elem = $(elem);

      elem.attr(TOOLTIP_ATTR, props.text);
      elem.tipsy({
        trigger : "manual",
        title : TOOLTIP_ATTR,
        html : true,
        opacity : 1,
        gravity : TOOLTIP_GRAVITIES[props.location] || $.fn.tipsy.autoNS
      });
      elem.tipsy("show");

      return elem.data("tipsy").$tip[0];
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
