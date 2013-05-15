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
    function packContainers(id) {
      container = $("#" + id);
      container.append(table_container);
    };

    function parseIP(e, obj) {
      e.find("field").each(function() {
        if ($(this).attr("name") == "ip.src")
          obj["source"] = $(this).attr("show");

        if ($(this).attr("name") == "ip.dst")
          obj["destination"] = $(this).attr("show");
      });
    };

    function parseFrame(e, obj) {
      e.find("field").each(function() {
        if ($(this).attr("name") == "frame.time_relative")
          obj["time"] = $(this).attr("show");

        if ($(this).attr("name") == "frame.number")
          obj["no"] = $(this).attr("show");

        if ($(this).attr("name") == "frame.len")
          obj["length"] = $(this).attr("show");
      });
    };

    function parsePdml() {
      $xml.find("packet").each(function() {
        var row = {};

        $(this).find("proto").each(function() {
          if ($(this).attr("name") == "frame")
            parseFrame($(this), row);

          if ($(this).attr("name") == "ip")
            parseIP($(this), row);
        });

        handler.addRow([
          row["no"],
          row["time"],
          row["source"],
          row["destination"],
          "_",
          row["length"],
          "_"]
        );
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

          if ($xml.find("pdml").attr("version") != 0) {
            console.log("Error. Uncompatible pdml version");
            return false;
          }

          parsePdml();

          return true;
        } catch (err) {
          // Error parsing xml
          return false;
        }
      }
    };
  })();

})();
