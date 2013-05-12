$(window).load( function() {
  var wireshark = Webshark.Analyzer({
    container: "whireshark",
    configure: DragAndDrop.configure,
    render: DragAndDrop.html
  });
});
