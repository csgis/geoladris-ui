define([ "jquery", "message-bus", "./commons", "nouislider" ], function($, bus, commons, noUiSlider) {
  return function(props) {
    var div = commons.getOrCreateElem("div", {
      parent : props.parent,
      css : "ui-slider-container"
    });

    var label = commons.getOrCreateElem("label", {
      parent : div[0],
      html : props.label,
      css : "ui-slider-label"
    });

    if (!props.label) {
      label[0].style.display = "none";
    }

    var slider = commons.getOrCreateElem("div", {
      id : props.id,
      parent : div[0],
      css : "ui-slider-input " + (props.css || "")
    })[0];

    function dispatch(name) {
      slider.dispatchEvent(new CustomEvent(name, {
        detail : {
          value : parseFloat(slider.noUiSlider.get())
        }
      }));
    }

    function addValues(values) {
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
          snap : true
        });
      }

      slider.noUiSlider.on("change", function() {
        dispatch("change");
      });
      slider.noUiSlider.on("slide", function() {
        dispatch("slide");
      });
    }

    addValues(props.values);

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

      bus.listen("ui-slider:" + props.id + ":set-label", function(e, labelText) {
        label.text(labelText);
        if (labelText) {
          label.show();
        } else {
          label.hide();
        }
      });
    }

    return $(slider);
  }
});