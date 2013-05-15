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
  DataTablesHandler.Table = function (obj) {
    this.container = $('<table id="datatables_id"></table>');
    var thead = $('<thead></thead>');
    var tr = $('<tr></tr>');
    var that = this;

    this.container.html(thead);
    thead.html(tr);

    function create_columns(columns) {

      for(var i = 0; i < columns.length; i++) {
        tr.append('<th>' + columns[i] + '</th>');
        console.log("Append: " + columns[i]);
      }
    };

    if (obj.columns)
      create_columns(obj.columns);
  };

  DataTablesHandler.Table.prototype = {
    render: function() {
      return this.container;
    }
  };

})();
