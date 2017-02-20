define([ "message-bus", "./commons", "nouislider" ], function(bus, commons, noUiSlider) {
  return function(props) {
    var container = commons.createContainer(props.id, props.parent, props.css);
    var label = commons.createLabel(props.id, container, props.label);
    var slider = commons.getOrCreateElem("div", {
      id : props.id,
      parent : container,
      css : "ui-slider-input " + (props.css || "")
    });

    commons.linkDisplay(slider, container);

    function dispatch(name) {
      slider.dispatchEvent(new CustomEvent(name, {
        detail : {
          value : parseFloat(slider.noUiSlider.get())
        }
      }));
    }

    function addValues(values, snap) {
      if (!values || values.constructor !== Array) {
        return;
      }

      values.sort(function(a, b) {
        return a - b;
      });

      var range = {
        "min" : values[0],
        "max" : values[values.length - 1]
      }

      var unitPerc = 100.0 / (range.max - range.min);
      for (var i = 1; i < values.length - 1; i++) {
        var value = values[i];
        var perc = unitPerc * (value - range.min);
        range[perc + "%"] = value;
      }

      if (slider.noUiSlider) {
        slider.noUiSlider.updateOptions({
          start : values[0],
          range : range
        });
      } else {
        noUiSlider.create(slider, {
          start : values[0],
          range : range,
          snap : snap
        });
      }

      slider.noUiSlider.on("change", function() {
        dispatch("change");
      });
      slider.noUiSlider.on("slide", function() {
        dispatch("slide");
      });
    }

    addValues(props.values, props.snap);
    if (props.value) {
      slider.noUiSlider.set(props.value);
    }

    if (props.id) {
      bus.listen("ui-slider:" + props.id + ":set-values", function(e, values) {
        slider.innerHTML = "";
        addValues(values);
      });

      bus.listen("ui-slider:" + props.id + ":set-value", function(e, value) {
        slider.noUiSlider.set(value);
      });

      bus.listen(props.id + "-field-value-fill", function(e, message) {
        message[props.id] = parseFloat(slider.noUiSlider.get());
      });
    }

    return slider;
  }
});