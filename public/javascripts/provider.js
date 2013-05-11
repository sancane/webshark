var DragAndDrop = (function () {
  
  var module = {};

  var container_e = $('<div id="drop_container"></div>');
  var drop_e = $('<div id="drop"><p>Drop a file here.</p></div>');
  var list_e = $('<div id="list"></div>');
  var bar_e = $('<div id="bar"></div>');

  var error_container = $('<div id="error"></div>');
  var error_e = $('<p>Your browser does not support the HTML5 FileReader.</p>');

  var progress_e = $('<progress value="0" max="100"></progress>');

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
    container_e.bind({
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
      bar_e.fadeIn();
    };

    reader.onprogress = function(e) {
      if (!e.lengthComputable)
        return;

      var percentLoaded = Math.round((e.loaded / e.total) * 100);
      progress_e.val(percentLoaded);
    };

    reader.onerror = function(e) {
      console.log("error");
    };

    reader.onload = function(e) {
      console.log("Load");
    };

    reader.onloadend = function(e) {
      bar_e.fadeOut();
    };
  }

  module.html = function (render) {
    if(window.FileReader) {
      reader = new FileReader();
      addHandlers();
      addCSS();
      container_e.html(drop_e);
      container_e.append(list_e);
      bar_e.html(progress_e);
      container_e.append(bar_e);
      list_e.hide();
      bar_e.hide();
    } else {
      error_container.append(error_e);
      container_e.html(error_container);
    }

    render(container_e);
  }

  return module;

}());
