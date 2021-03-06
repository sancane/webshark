/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2013
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Webshark Module
 */
var Webshark = {};

(function () {

  var PACKETS_BUNCHED = 500;

  // basic extend function
  function extend(B, A){
    function I(){};
    I.prototype = A.prototype;
    B.prototype = new I;
    B.prototype.constructor = B;
    B.prototype.parent = A;
  };

  /**********************************
   * Generic extractor handler class
   **********************************/
  var ProtocolHandler = function(protocol) {
    this.proto = protocol;
  };

  // prototype assignment
  ProtocolHandler.prototype = (function() {
    // prototype
    return {
      constructor: ProtocolHandler,

      getProtocol: function() {
        return this.proto.toUpperCase();
      },
      // Fill table raw identified by rawObj with the information extracted from
      // xml tag proto which is contained in the pdml file
      handle: function(proto, rawObj) {}
    };
  })();

  /***************************************
   * Class which extracts row information
   ***************************************/
  var DataExtractor = function () {};

  // prototype assignment
  DataExtractor.prototype = (function() {
    var extractors = {};

    // prototype
    return {
      constructor: DataExtractor,

      addHandler: function(handler) {
        if (extractors[handler.proto])
          console.log("Overwriting handler for proto: " + handler.proto);

        extractors[handler.proto] = handler;
      },
      getInfo: function(name, proto, raw) {
        if (extractors[name]) {
          extractors[name].handle(proto, raw);
          return;
        }

        // Try to get info if it is possible
        if (proto.attr("name").toUpperCase() != "MALFORMED" &&
                                                       proto.attr("showname")) {
          raw["info"] = proto.attr("showname");
          raw["protocol"] = proto.attr("name").toUpperCase();
        }
      }
    };
  })();

  var extractor = new DataExtractor();

  /**************************
   * Webshark Analyzer Class
   **************************/
  Webshark.Analyzer = function () {};

  // prototype assignment
  Webshark.Analyzer.prototype = (function() {
    var $xml = null; // Whireshark pdml document

    var container = null;
    var handler = null;
    var table_container = $('<div id="whireshark_table"></div>');
    var packet_container = $('<div id="wireshark_package"></div>');

    // Private functions
/*
    function vSSL(version) {
      if (version == "0x0301")
        return "TLSv1";
      else if (version == "0x0300")
        return "SSLv3";
      else
        return "SSL(" + version +")";
    };

    function parseSSLProtocol(e, obj) {
      e.children("field").each(function() {
        if ($(this).attr("name") == "ssl.record") {
          $(this).children("field").each(function() {
            if ($(this).attr("name") == "ssl.record.version"
                                                            && !obj["protocol"])
              obj["protocol"] = vSSL($(this).attr("show"));
          });
        }
      });
    };

    function addInfo(obj, info, separator, first) {
      if (!obj["info"])
        obj["info"] = info;
      else if (arguments.length > 3)
        if (first)
          obj["info"] = info + separator + obj["info"];
        else
          obj["info"] += separator + info;
      else
        obj["info"] += separator + info;
    };

    function parseSSLInfo(e, obj) {
      e.children("field").each(function() {
        if ($(this).attr("name") == "ssl.record") {
          $(this).children("field").each(function() {
            if ($(this).attr("name") == "ssl.record.content_type")
              addInfo(obj, $(this).attr("showname"), ", ");
          });
        }
      });
    };
*/
    function packContainers(id) {
      container = $("#" + id);
      container.html(table_container);
      container.append(packet_container);
    };

    function parsePacket(packet) {
      var row = {};

      packet.children("proto").each(function () {
        extractor.getInfo($(this).attr("name"), $(this), row);
      });

      return row;
    };

    function parseTags(pdml) {
      var packets = pdml.children("packet");
      var size = packets.length;
      var rows = [];

      packets.each(function(index) {
        var obj = parsePacket($(this));
        var row = [
          (obj["no"]) ? obj["no"] : "",
          (obj["time"]) ? obj["time"] : "",
          (obj["source"]) ? obj["source"] : "",
          (obj["destination"]) ? obj["destination"] : "",
          (obj["protocol"]) ? obj["protocol"] : "",
          (obj["length"]) ? obj["length"] : "",
          (obj["info"]) ? obj["info"] : ""
        ];

        rows.push(row);

        if (index + 1 % PACKETS_BUNCHED == 0) {
          handler.addRow(rows, true);
          rows = [];
        }
      });

      if (rows.length > 0)
        handler.addRows(rows, true);
    };

    // prototype
    return {
      constructor: Webshark.Analyzer,

      init: function(obj) {
        if (!obj)
          return;

        if (obj.container)
          packContainers(obj.container);

        if (obj.handler) {
          handler = new obj.handler();
          handler.init({
            scrollableX: true,
            scrollableY: true,
            columns: ["No",
              "Time",
              "Source",
              "Destination",
              "Protocol",
              "Length",
              "Info"
            ]
          });
          table_container.append(handler.render());
        }
      },
      loadContent: function(content) {
        try {
          var xmlDoc = $.parseXML(content);
          $xml = $(xmlDoc);
          var pdml = $xml.children("pdml");

          if (pdml.attr("version") != 0) {
            console.log("Error. Uncompatible pdml version");
            return false;
          }

          parseTags(pdml);

          return true;
        } catch (err) {
          // Error parsing xml
          console.log(err);
          return false;
        }
      }
    };
  })();

  /****************************************************************************
   * Handler objects go here
   ****************************************************************************/

  // Frame Handler
  var FrameHandler = function () {
    ProtocolHandler.call(this, "frame");
  };

  extend(FrameHandler, ProtocolHandler);

  FrameHandler.prototype = (function(proto) {
    proto.handle = function(proto, raw) {
      proto.children("field").each(function() {
        if ($(this).attr("name") == "frame.time_relative")
          raw["time"] = $(this).attr("show");

        if ($(this).attr("name") == "frame.number")
          raw["no"] = $(this).attr("show");

        if ($(this).attr("name") == "frame.len")
          raw["length"] = $(this).attr("show");
      });
    };

    return proto;
  })(FrameHandler.prototype);

  // Eth Handler
  var Eth = function () {
    ProtocolHandler.call(this, "eth");
  };

  extend(Eth, ProtocolHandler);

  Eth.prototype = (function(proto) {
    proto.handle = function(proto, raw) {
      raw["info"] = proto.attr("showname");
      raw["protocol"] = this.getProtocol();

      proto.children("field").each(function() {
        if ($(this).attr("name") == "eth.src")
          raw["source"] = $(this).attr("show");

        if ($(this).attr("name") == "eth.dst")
          raw["destination"] = $(this).attr("show");
      });
    };

    return proto;
  })(Eth.prototype);

  // IP Handler
  var IPHandler = function () {
    ProtocolHandler.call(this, "ip");
  };

  extend(IPHandler, ProtocolHandler);

  IPHandler.prototype = (function(proto) {
    proto.handle = function(proto, raw) {
      var protocol = this.getProtocol();

      proto.children("field").each(function() {
        if ($(this).attr("name") == "ip.src")
          raw["source"] = $(this).attr("show");

        if ($(this).attr("name") == "ip.dst")
          raw["destination"] = $(this).attr("show");

        if ($(this).attr("name") == "ip.version")
          raw["protocol"] = protocol + "v" + $(this).attr("show");
      });
    };

    return proto;
  })(IPHandler.prototype);

  // Add protocol handlers
  extractor.addHandler(new FrameHandler());
  extractor.addHandler(new Eth());
  extractor.addHandler(new IPHandler());
})();
