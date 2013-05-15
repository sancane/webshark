$(window).load( function() {
  var wireshark = new Webshark.Analyzer();

  wireshark.init({
    container: "whireshark",
    handler: DataTablesHandler.Table
  });

  // Configure DragandDrop module to use wireshark
  DragAndDrop.use(wireshark.loadContent);

  // Init drag and drop
  var dragdrop = $("#dragdrop_container");
  dragdrop.html(DragAndDrop.html);

});
