import React from "react";
import { TextTableProps, LayoutItem } from "../Types";
import { getDefaultFontSize, getItemTitle, hasTitle, itemSumSize, useCommandCall } from "../Utils";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const TextTable: React.FC<TextTableProps> = ({
  layoutItem,
  updateItem,
  removeItem,
  addItem,
  updateColSize,
}) => {
  const defaultColSize = (layoutItem: LayoutItem) => {
    return Math.floor(((4.9 * layoutItem.w) - 25 + layoutItem.w) / (layoutItem.data?.at(0)?.length ?? 1));
  };

  const tableHeaderCell = (
    layoutItem: LayoutItem,
    updateItem: (id: string, field: string, value: string) => void,
    removeItem: (id: string, rowIndex: number, colIndex: number) => void,
    updateColSize: (id: string, colIndex: number, size: number) => void,
    addColumn: () => void,
    fontSize: (offset: number) => number,
    header: string,
    colIndex: number
  ) => {
    return (
      <th
        id="text-table-cell"
        key={colIndex}
        scope="col"
      >
        <div id="text-table-cell-headcontent" className={layoutItem.isLocked ? "locked" : "unlocked"}>
          <ResizableBox
            width={layoutItem.colSizes?.[colIndex] || defaultColSize(layoutItem)}
            axis={layoutItem.isLocked ? "none" : "x"}
            resizeHandles={['e']}
            onResizeStop={(e, data) => updateColSize(layoutItem.i, colIndex, data.size.width)}
          >
            <input
              id="text-table-header-input" // Header input
              type="text"
              readOnly={layoutItem.isLocked}
              value={header}
              onChange={(e) => updateItem(layoutItem.i, "data-" + 0 + "-" + colIndex, e.target.value)}
              style={{ fontSize: fontSize(0) }}
            />
            {
              !layoutItem.static && ( // Only show add/remove buttons if not static
                <div id="buttons-case">
                  {
                    layoutItem.data?.at(0)?.length === colIndex + 1 && (
                      <div
                        id="text-table-add-column"
                        className="add-button"
                        onMouseDown={addColumn}
                      >
                        <span className="button-text">&#43;</span>
                      </div>
                    )
                  }
                  {
                    layoutItem.data?.at(0)?.length !== 1 && ( // Only show remove button if more than one column
                      <div
                        id="text-table-remove-col"
                        className="remove-button"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          layoutItem.data?.forEach((_, rowIndex) => removeItem(layoutItem.i, rowIndex, colIndex))
                        }}
                      >
                        <span className="button-text">&times;</span>
                      </div>
                    )
                  }
                </div>
              )
            }
          </ResizableBox>
        </div>
      </th>
    )
  };

  const tableHeader = (
    layoutItem: LayoutItem,
    updateItem: (id: string, field: string, value: string) => void,
    removeItem: (id: string, rowIndex: number, colIndex: number) => void,
    updateColSize: (id: string, colIndex: number, size: number) => void,
    addColumn: () => void,
    fontSize: (offset: number) => number
  ) => {
    return (
      !(layoutItem.static && layoutItem.data?.at(0)?.every(d => d == "")) && ( // Only show header if not static and not empty
        <thead id="text-table-header">
          <tr>
            {
              layoutItem.data?.at(0)?.map((header: string, colIndex: number) => ( // Header row
                tableHeaderCell(layoutItem, updateItem, removeItem, updateColSize, addColumn, fontSize, header, colIndex)
              ))
            }
          </tr>
        </thead>
      )
    )
  };

  const tableBodyCell = (
    layoutItem: LayoutItem,
    updateItem: (id: string, field: string, value: string) => void,
    removeItem: (id: string, rowIndex: number, colIndex: number) => void,
    updateColSize: (id: string, colIndex: number, size: number) => void,
    addRow: () => void,
    fontSize: (offset: number) => number,
    rowIndex: number,
    colIndex: number,
    cell: string
  ) => {
    return (
      <td
        id="text-table-cell"
        className={layoutItem.isLocked ? "locked" : "unlocked"}
        key={colIndex}
        style={{ width: (layoutItem.colSizes?.[colIndex] || defaultColSize(layoutItem)) }}
      >
        <ResizableBox
          width={layoutItem.colSizes?.[colIndex] || defaultColSize(layoutItem)}
          axis={layoutItem.isLocked ? "none" : "x"}
          resizeHandles={['e']}
          onResizeStop={(e, data) => updateColSize(layoutItem.i, colIndex, data.size.width)}
        >
          <div id={layoutItem.static || layoutItem.data?.at(rowIndex)?.length !== colIndex + 1 ? "text-table-cell-content" : "text-table-cell-content-on-edit"}>
            { // Renders a Checkbox or Textarea
              useCommandCall(layoutItem, cell, rowIndex, colIndex, updateItem, fontSize(-2), layoutItem.isLocked, "text-table-cell-data")
            }
            {
              !layoutItem.static && layoutItem.data?.at(rowIndex)?.length === colIndex + 1 && ( // Only show add/remove buttons if not static and is the last cell in the row
                <div id="buttons-case">
                  {
                    layoutItem.data?.length === rowIndex + 1 && (
                      <div
                        id="text-table-add-row"
                        className="add-button"
                        onMouseDown={addRow}
                      >
                        <span className="button-text">&#43;</span>
                      </div>
                    )
                  }
                  {
                    layoutItem.data?.length > 2 && ( // Only show remove button if more than one row
                      <div
                        id="text-table-remove-row"
                        className="remove-button"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          removeItem(layoutItem.i, rowIndex, -1)
                        }}
                      >
                        <span className="button-text">&times;</span>
                      </div>
                    )
                  }
                </div>
              )
            }
          </div>
        </ResizableBox>
      </td>
    )
  };

  const tableBody = (
    layoutItem: LayoutItem,
    updateItem: (id: string, field: string, value: string) => void,
    removeItem: (id: string, rowIndex: number, colIndex: number) => void,
    updateColSize: (id: string, colIndex: number, size: number) => void,
    addRow: () => void,
    fontSize: (offset: number) => number
  ) => {
    return (
      <tbody id="text-table-body">
        {
          layoutItem.data?.map((row: string[], rowIndex: number) => ( // Body rows
            rowIndex === 0 ? null : // Skip the header row
              <tr key={rowIndex}>
                {
                  row.map((cell: string, colIndex: number) => ( // Body cells
                    tableBodyCell(layoutItem, updateItem, removeItem, updateColSize, addRow, fontSize, rowIndex, colIndex, cell)
                  ))
                }
              </tr>
          ))}
      </tbody>
    )
  };

  const addRow = () => {
    layoutItem.data?.at(0)?.forEach((_, index) => {
      addItem(layoutItem.i, layoutItem.data?.length ?? 0, "");
    });
  };

  const addColumn = () => {
    layoutItem.data?.forEach((_, rowIndex) => {
      addItem(layoutItem.i, rowIndex, "");
    });
  };

  const fontSize = (offset: number = 0): number => {
    return Math.min((getDefaultFontSize() * itemSumSize(layoutItem, 0.1, 0.4, 0.8)), getDefaultFontSize() + 4) + offset;
  };

  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "text-table-content" : "text-table-content-notitle"}>
        {getItemTitle(layoutItem, updateItem, fontSize(), "text-table-title")}
        <div id="text-table-table-div">
          <table id="text-table-table">
            <>
              {tableHeader(layoutItem, updateItem, removeItem, updateColSize, addColumn, fontSize)}
              {tableBody(layoutItem, updateItem, removeItem, updateColSize, addRow, fontSize)}
            </>
          </table>
        </div>
      </div>
    </>
  );
};

export default TextTable;