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

  /**
   * Webshark Analyzer Class
   */
  Webshark.Analyzer = function () {
  };

  // prototype assignment
  Webshark.Analyzer.prototype = (function() {
    var $xml = null; // Whireshark pdml document

    var container = null;
    var handler = null;
    var table_container = $('<div id="whireshark_table"></div>');

    // Private functions
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

    function parseIGMPInfo(e, obj) {
      e.children("field").each(function() {
        switch ($(this).attr("name")) {
        case "igmp.version":
          addInfo(obj, $(this).attr("showname"), ", ", true);
          break;
        case "igmp.type":
          addInfo(obj, $(this).attr("showname"), ", ");
          break;
        };
      });
    };

    function parseInfo(e, obj) {;
      switch (e.attr("name")) {
      case "ssl":
        parseSSLInfo(e, obj);
        break;
      case "igmp":
        parseIGMPInfo(e, obj);
        break;
      default:
        obj["info"] = e.attr("showname");
      };
    };

    function parseProtocol(e, obj) {
      switch (e.attr("name")) {
      case "ssl":
        parseSSLProtocol(e, obj);
        break;
      default:
        obj["protocol"] = e.attr("name").toUpperCase();
      };

    };

    function packContainers(id) {
      container = $("#" + id);
      container.append(table_container);
    };

    function parseIP(e, obj) {
      e.children("field").each(function() {
        if ($(this).attr("name") == "ip.src")
          obj["source"] = $(this).attr("show");

        if ($(this).attr("name") == "ip.dst")
          obj["destination"] = $(this).attr("show");
      });
    };

    function parseFrame(e, obj) {
      e.children("field").each(function() {
        if ($(this).attr("name") == "frame.time_relative")
          obj["time"] = $(this).attr("show");

        if ($(this).attr("name") == "frame.number")
          obj["no"] = $(this).attr("show");

        if ($(this).attr("name") == "frame.len")
          obj["length"] = $(this).attr("show");
      });
    };

    function parseTags(pdml) {
      pdml.children("packet").each(function() {
        var row = {};
        var proto = $(this).children("proto");

        proto.each(function(index) {
          if ($(this).attr("name") == "frame")
            parseFrame($(this), row);

          if ($(this).attr("name") == "ip")
            parseIP($(this), row);

          if (index == proto.length - 1) {
            parseProtocol($(this), row);
            parseInfo($(this), row);
          }
        });

        handler.addRow([
          row["no"],
          row["time"],
          row["source"],
          row["destination"],
          row["protocol"],
          row["length"],
          (row["info"]) ? row["info"] : ""
        ]);
      });
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

})();
