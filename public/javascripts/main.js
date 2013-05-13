$(window).load( function() {
  /* Init drag and drop */
  var dragdrop = $("#dragdrop_container");
  dragdrop.html(DragAndDrop.html);

  var wireshark = Webshark.Analyzer({
    container: "whireshark"
  });
});
