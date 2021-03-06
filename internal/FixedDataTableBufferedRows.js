"use strict";

var _React = require('./React');

var _React2 = _interopRequireDefault(_React);

var _FixedDataTableRowBuffer = require('./FixedDataTableRowBuffer');

var _FixedDataTableRowBuffer2 = _interopRequireDefault(_FixedDataTableRowBuffer);

var _FixedDataTableRow = require('./FixedDataTableRow');

var _FixedDataTableRow2 = _interopRequireDefault(_FixedDataTableRow);

var _cx = require('./cx');

var _cx2 = _interopRequireDefault(_cx);

var _emptyFunction = require('./emptyFunction');

var _emptyFunction2 = _interopRequireDefault(_emptyFunction);

var _joinClasses = require('./joinClasses');

var _joinClasses2 = _interopRequireDefault(_joinClasses);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableBufferedRows
 * @typechecks
 */

var PropTypes = _React2.default.PropTypes;


var FixedDataTableBufferedRows = _React2.default.createClass({
  displayName: "FixedDataTableBufferedRows",


  propTypes: {
    isScrolling: PropTypes.bool,
    defaultRowHeight: PropTypes.number.isRequired,
    firstRowIndex: PropTypes.number.isRequired,
    firstRowOffset: PropTypes.number.isRequired,
    fixedColumns: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
    offsetTop: PropTypes.number.isRequired,
    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    onRowMouseDown: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func,
    rowClassNameGetter: PropTypes.func,
    rowsCount: PropTypes.number.isRequired,
    rowHeightGetter: PropTypes.func,
    rowDropdownGetter: PropTypes.func,
    rowDropdownHeightGetter: PropTypes.func,
    rowPositionGetter: PropTypes.func.isRequired,
    scrollLeft: PropTypes.number.isRequired,
    scrollableColumns: PropTypes.array.isRequired,
    showLastRowBorder: PropTypes.bool,
    width: PropTypes.number.isRequired
  },

  getInitialState: function getInitialState() /*object*/{
    this._rowBuffer = new _FixedDataTableRowBuffer2.default(this.props.rowsCount, this.props.defaultRowHeight, this.props.height, this._getRowHeight);
    return {
      rowsToRender: this._rowBuffer.getRows(this.props.firstRowIndex, this.props.firstRowOffset)
    };
  },
  componentWillMount: function componentWillMount() {
    this._staticRowArray = [];
    this._initialRender = true;
  },
  componentDidMount: function componentDidMount() {
    setTimeout(this._updateBuffer, 1000);
    this._initialRender = false;
  },
  componentWillReceiveProps: function componentWillReceiveProps( /*object*/nextProps) {
    if (nextProps.rowsCount !== this.props.rowsCount || nextProps.defaultRowHeight !== this.props.defaultRowHeight || nextProps.height !== this.props.height) {
      this._rowBuffer = new _FixedDataTableRowBuffer2.default(nextProps.rowsCount, nextProps.defaultRowHeight, nextProps.height, this._getRowHeight);
    }
    if (this.props.isScrolling && !nextProps.isScrolling) {
      this._updateBuffer();
    } else {
      this.setState({
        rowsToRender: this._rowBuffer.getRows(nextProps.firstRowIndex, nextProps.firstRowOffset)
      });
    }
  },
  _updateBuffer: function _updateBuffer() {
    if (this.isMounted()) {
      this.setState({
        rowsToRender: this._rowBuffer.getRowsWithUpdatedBuffer()
      });
    }
  },
  shouldComponentUpdate: function shouldComponentUpdate() /*boolean*/{
    // Don't add PureRenderMixin to this component please.
    return true;
  },
  componentWillUnmount: function componentWillUnmount() {
    this._staticRowArray.length = 0;
  },
  render: function render() /*object*/{
    var props = this.props;
    var rowClassNameGetter = props.rowClassNameGetter || _emptyFunction2.default;
    var rowPositionGetter = props.rowPositionGetter;

    var rowsToRender = this.state.rowsToRender;

    //Sort the rows, we slice first to avoid changing original
    var sortedRowsToRender = rowsToRender.slice().sort(function (a, b) {
      return a - b;
    });
    var rowPositions = {};

    //Row position calculation requires that rows are calculated in order
    sortedRowsToRender.forEach(function (rowIndex) {
      rowPositions[rowIndex] = rowPositionGetter(rowIndex);
    });

    this._staticRowArray.length = rowsToRender.length;

    var baseOffsetTop = props.firstRowOffset - props.rowPositionGetter(props.firstRowIndex) + props.offsetTop;

    for (var i = 0; i < rowsToRender.length; ++i) {
      var rowIndex = rowsToRender[i];
      var currentRowHeight = this._getRowHeight(rowIndex);
      var currentRowDropdownHeight = this._getRowDropdownHeight(rowIndex);
      var currentRowDropdown = this._getRowDropdown(rowIndex);
      var rowOffsetTop = baseOffsetTop + rowPositions[rowIndex];

      var hasBottomBorder = rowIndex === props.rowsCount - 1 && props.showLastRowBorder;

      this._staticRowArray[i] = _React2.default.createElement(_FixedDataTableRow2.default, {
        key: i,
        isScrolling: props.isScrolling,
        index: rowIndex,
        width: props.width,
        height: currentRowHeight,
        dropdown: currentRowDropdown,
        dropdownHeight: currentRowDropdownHeight,
        scrollLeft: Math.round(props.scrollLeft),
        offsetTop: Math.round(rowOffsetTop),
        fixedColumns: props.fixedColumns,
        scrollableColumns: props.scrollableColumns,
        onClick: props.onRowClick,
        onDoubleClick: props.onRowDoubleClick,
        onMouseDown: props.onRowMouseDown,
        onMouseEnter: props.onRowMouseEnter,
        onMouseLeave: props.onRowMouseLeave,
        className: (0, _joinClasses2.default)(rowClassNameGetter(rowIndex), (0, _cx2.default)('public/fixedDataTable/bodyRow'), (0, _cx2.default)({
          'fixedDataTableLayout/hasBottomBorder': hasBottomBorder,
          'public/fixedDataTable/hasBottomBorder': hasBottomBorder
        }))
      });
    }

    return _React2.default.createElement(
      "div",
      null,
      this._staticRowArray
    );
  },
  _getRowHeight: function _getRowHeight( /*number*/index) /*number*/{
    return this.props.rowHeightGetter ? this.props.rowHeightGetter(index) : this.props.defaultRowHeight;
  },
  _getRowDropdown: function _getRowDropdown(index) {
    return this.props.rowDropdownGetter ? this.props.rowDropdownGetter(index) : null;
  },
  _getRowDropdownHeight: function _getRowDropdownHeight( /*number*/index) /*number*/{
    return this.props.rowDropdownHeightGetter ? this.props.rowDropdownHeightGetter(index) : 0;
  }
});

module.exports = FixedDataTableBufferedRows;