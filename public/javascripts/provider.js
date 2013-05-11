var DragAndDrop = (function () {
  
  var module = {};

  var container_e = $('<div id="drop_container" class="leave"></div>');
  var drop_e = $('<div id="drop"><p>Drop a file here!</p></div>');
  var list_e = $('<div id="list"></div>');
  var bar_e = $('<div id="bar"></div>');

  var error_container = $('<div id="error"></div>');
  var error_e = $('<p>Your browser does not support the HTML5 FileReader.</p>');

  var progress_e = $('<progress value="0" max="100"></progress>');

  // variable reader will be a FileReader if it is supported
  var reader = null;
  var fileName = null;
  var config = null;

  function refreshXML(content) {
    if (config.loadFile)
      config.loadFile(content);
  }

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
        container_e.attr('class', 'over');
        preventDefaultPropagation(e);
        return false;
      },
      dragenter: function(e) {
        container_e.attr('class', 'over');
        preventDefaultPropagation(e);
        return false;
      },
      dragleave: function(e) {
        container_e.attr('class', 'leave');
        preventDefaultPropagation(e);
        return false;
      },
      drop: function(e) {
        container_e.attr('class', 'leave');
        var evt = preventDefaultPropagation(e);

        // jQuery wraps the originalEvent, so we try to detect that here.
        evt = evt.originalEvent || evt;            
        var files = (evt.files || evt.dataTransfer.files);

        if (files.length <= 0)
          return false;

        fileName = files[0].name;

        reader.readAsText(files[0]);
        return false;
      }
    });

    reader.onloadstart = function(e) {
      bar_e.stop();
      bar_e.fadeIn();
      list_e.hide();
    };

    reader.onprogress = function(e) {
      if (!e.lengthComputable)
        return;

      var percentLoaded = Math.round((e.loaded / e.total) * 100);
      progress_e.val(percentLoaded);
    };

    reader.onerror = function(e) {
      // Error
      list_e.html('<p class="error">Error loading ' + fileName + '</p');
    };

    reader.onload = function(e) {
      // Read was success
      refreshXML(e.target.result);
      list_e.html('<p class="success" >' + fileName + '</p');
    };

    reader.onloadend = function(e) {
      bar_e.fadeOut(function() {
        list_e.show();
      });
    };
  }

  module.configure = function (obj) {
    config = obj;
  }

  module.html = function (render_cb) {
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

    render_cb(container_e);
  }

  return module;

}());
