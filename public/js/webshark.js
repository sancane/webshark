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
  Webshark.Analyzer.prototype = (function(){
    var container = null;
    var handler = null;
    var table_container = $('<div id="whireshark_table"></div>');

    function packContainers(id) {
      container = $("#" + id);
      container.append(table_container);
    }

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
            columns: ["No", "Time", "Source", "Destination", "Protocol", "Length", "Info"]
          });
          table_container.append(handler.render());
        }
      },
      loadContent: function(content) {
        try {
          var xmlDoc = $.parseXML(content);
          var $xml = $(xmlDoc);
          console.log($xml.find("pdml").attr("version"));

          $xml.find("proto").each(function() {
            console.log($(this).attr("name"));
          });

          return true;
        } catch (err) {
          // Error parsing xml
          return false;
        }
      }
    };
  })();

})();