define([ "jquery", "message-bus", "./ui-commons", "./ui-buttons", "./ui-dialog" ], function($, bus, commons, buttons, uiDialog) {
  return function(msg) {
    msg.modal = true;
    msg.css = (msg.css || "") + " ui-confirm-dialog";
    if (!msg.messages) {
      msg.messages = {};
    }

    var dialog = uiDialog(msg);

    if (msg.messages.question) {
      commons.getOrCreateElem("div", {
        id : msg.id + "-message",
        parent : msg.id,
        css : "ui-confirm-dialog-message"
      });
      $("#" + msg.id + "-message").html(msg.messages["question"]);
    }

    var buttonsContainer = msg.id + "-confirm-buttons-container";
    commons.getOrCreateElem("div", {
      id : buttonsContainer,
      parent : msg.id,
      css : "ui-confirm-dialog-buttons-container"
    });
    buttons({
      id : msg.id + "-ok",
      parent : buttonsContainer,
      css : "dialog-ok-button ui-confirm-dialog-ok",
      text : msg.messages.ok,
      sendEventName : "ui-confirm-dialog:" + msg.id + ":ok"
    });
    buttons({
      id : msg.id + "-cancel",
      parent : buttonsContainer,
      css : "dialog-ok-button ui-confirm-dialog-cancel",
      text : msg.messages.cancel,
      sendEventName : "ui-confirm-dialog:" + msg.id + ":cancel"
    });

    bus.listen("ui-confirm-dialog:" + msg.id + ":cancel", function() {
      bus.send("ui-hide", msg.id);
    });

    bus.listen("ui-confirm-dialog:" + msg.id + ":ok", function() {
      bus.send("ui-hide", msg.id);
    });

    return dialog;
  }
});
