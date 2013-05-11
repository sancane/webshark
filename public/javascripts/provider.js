var DragAndDrop = (function () {
  
  var module = {};

  var container_e = $('<div id="drop_container"></div>');
  var drop_e = $('<div id="drop"><p>Drop a file here.</p></div>');
  var list_e = $('<div id="list"></div>');

  var error_container = $('<div id="error"></div>');
  var error_e = $('<p>Your browser does not support the HTML5 FileReader.</p>');

  // The file reader is FileReader is supported
  var reader = null;

  function addCSS() {
    var css_e = $('<link rel="stylesheet" href="./css/draganddrop.css" type="text/css" />');
    $('head').append(css_e);
  }

  function preventDefaultPropagation(e) {
    var evt = e || window.event;
    evt.preventDefault();
    evt.stopPropagation();

    return evt;
  }

  function addHandlers() {
    drop_e.bind({
      dragover: function(e) {
        preventDefaultPropagation(e);
        return false;
      },
      dragend: function(e) {
        //$(this).removeClass('hover');
        //return false;
      },
      dragenter: function(e) {
        preventDefaultPropagation(e);
        return false;
      },
      drop: function(e) {
        var evt = preventDefaultPropagation(e);

        // jQuery wraps the originalEvent, so we try to detect that here.
        evt = evt.originalEvent || evt;            
        var files = (evt.files || evt.dataTransfer.files);

        if (files.length <= 0)
          return false;

        reader.readAsText(files[0]);
        return false;
      }
    });

    reader.onloadstart = function(e) {
      console.log("Load start");
    };
    reader.onprogress = function(e) {
      console.log("Progress");
    };
    reader.onerror = function(e) {
      console.log("error");
    };
    reader.onload = function(e) {
      console.log("Load");
    };
    reader.onloadend = function(e) {
      console.log("Load end");
    };
  }

  module.html = function (render) {
    if(window.FileReader) {
      reader = new FileReader();
      addHandlers();
      addCSS();
      container_e.html(drop_e);
      container_e.append(list_e);
    } else {
      error_container.append(error_e);
      container_e.html(error_container);
    }

    render(container_e);
  }

  return module;

}());
