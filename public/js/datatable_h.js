/**
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
 * DataTables Handler Module
 */
var DataTablesHandler = {};

(function () {

  /**
   * This class manages Datatables library
   */
  DataTablesHandler.Table = function () {
  };

  // prototype assignment
  DataTablesHandler.Table.prototype = (function() {
    // Table options
    var options  = {
      "bJQueryUI": true
    };

    var container = $('<div></div>');

    var table = $('<table id="datatables_id" cellpadding="0" cellspacing="0" border="0" class="display"></table>');
    var thead = $('<thead></thead>');
    var tbody = $('<tbody></tbody>');

    var that = this;

    container.html(table);
    table.html(thead);
    table.append(tbody);

    // private methods
    function create_columns(columns) {
      var tr = $('<tr></tr>');
      thead.html(tr);

      for(var i = 0; i < columns.length; i++)
        tr.append('<th>' + columns[i] + '</th>');
    };

    // prototype
    return {
      constructor: DataTablesHandler.Table,

      init: function(obj) {
        if (obj.scrollableY) {
          options["sScrollY"] = "200px";
          options["bPaginate"] = false;
          options["bScrollCollapse"] = true;
        }

        if (obj.scrollableX) {
          options["sScrollX"] = "100%";
          options["sScrollXInner"] = "110%";
        }

        if (obj.columns)
          create_columns(obj.columns);
      },
      render: function() {
        table.dataTable(options);
        return container;
      },
      addRow: function(row) {
        table.dataTable().fnAddData(row);
      }
    };
  })();

})();
