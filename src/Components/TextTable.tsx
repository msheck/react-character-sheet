import { LayoutItem } from "../Types";
import { defaultFontSize, getItemTitle, hasTitle, useCheckbox } from "../Utils";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

function defaultColSize(layoutItem: LayoutItem) {
  //return defaultFontSize();
  return Math.floor(((4.9 * layoutItem.w) - 25 + layoutItem.w) / (layoutItem.data?.at(0)?.length ?? 1));
}

function tableHeaderCell(
  layoutItem: LayoutItem,
  updateItem: (id: string, field: string, value: string) => void,
  removeItem: (id: string, rowIndex: number, colIndex: number) => void,
  updateColSize: (id: string, colIndex: number, size: number) => void,
  addColumn: () => void,
  fontSize: () => number,
  header: string,
  colIndex: number
) {
  return (
    <th
      id="text-table-cell"
      key={colIndex}
      scope="col"
    >
      <div id="text-table-cell-headcontent">
        <ResizableBox
          width={layoutItem.colSizes?.[colIndex] || defaultColSize(layoutItem)}
          axis="x"
          resizeHandles={['e']}
          onResizeStop={(e, data) => updateColSize(layoutItem.i, colIndex, data.size.width)}
        >
          <input
            id="text-table-header-input" // Header input
            type="text"
            value={header}
            onChange={(e) => updateItem(layoutItem.i, "data-" + 0 + "-" + colIndex, e.target.value)}
            style={{ fontSize: fontSize() }}
          />
          {
            !layoutItem.static && ( // Only show add/remove buttons if not static
              <div id="buttons-case">
                {
                  layoutItem.data?.at(0)?.length === colIndex + 1 && (
                    <span
                      id="text-table-add-column"
                      className="add-button"
                      onMouseDown={addColumn}
                    >
                      &#43;
                    </span>
                  )
                }
                {
                  layoutItem.data?.at(0)?.length !== 1 && ( // Only show remove button if more than one column
                    <span
                      id="text-table-remove-col"
                      className="remove-button"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        layoutItem.data?.forEach((_, rowIndex) => removeItem(layoutItem.i, rowIndex, colIndex))
                      }}
                    >
                      &times;
                    </span>
                  )
                }
              </div>
            )
          }
        </ResizableBox>
      </div>
    </th>
  )
}

function tableHeader(
  layoutItem: LayoutItem,
  updateItem: (id: string, field: string, value: string) => void,
  removeItem: (id: string, rowIndex: number, colIndex: number) => void,
  updateColSize: (id: string, colIndex: number, size: number) => void,
  addColumn: () => void,
  fontSize: () => number
) {
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
}

function tableBodyCell(
  layoutItem: LayoutItem,
  updateItem: (id: string, field: string, value: string) => void,
  removeItem: (id: string, rowIndex: number, colIndex: number) => void,
  updateColSize: (id: string, colIndex: number, size: number) => void,
  addRow: () => void,
  fontSize: () => number,
  rowIndex: number,
  colIndex: number,
  cell: string
) {
  return (
    <td
      id="text-table-cell"
      key={colIndex}
      style={{ width: (layoutItem.colSizes?.[colIndex] || defaultColSize(layoutItem)) }}
    >
      <ResizableBox
        width={layoutItem.colSizes?.[colIndex] || defaultColSize(layoutItem)}
        axis="x"
        resizeHandles={['e']}
        onResizeStop={(e, data) => updateColSize(layoutItem.i, colIndex, data.size.width)}
      >
        <div id={layoutItem.static ? "text-table-cell-content" : "text-table-cell-content-on-edit"}>
          { // Renders a Checkbox or Textarea
            useCheckbox(layoutItem, cell, rowIndex, colIndex, updateItem, fontSize, "text-table-cell-data")
          }
          {
            !layoutItem.static && layoutItem.data?.at(rowIndex)?.length === colIndex + 1 && ( // Only show add/remove buttons if not static and is the last cell in the row
              <div id="buttons-case">
                {
                  layoutItem.data?.length === rowIndex + 1 && (
                    <span
                      id="text-table-add-row"
                      className="add-button"
                      onMouseDown={addRow}
                    >
                      &#43;
                    </span>
                  )
                }
                {
                  layoutItem.data?.length > 2 && ( // Only show remove button if more than one row
                    <span
                      id="text-table-remove-row"
                      className="remove-button"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        removeItem(layoutItem.i, rowIndex, -1)
                      }}
                    >
                      &times;
                    </span>
                  )
                }
              </div>
            )
          }
        </div>
      </ResizableBox>
    </td>
  )
}

function tableBody(
  layoutItem: LayoutItem,
  updateItem: (id: string, field: string, value: string) => void,
  removeItem: (id: string, rowIndex: number, colIndex: number) => void,
  updateColSize: (id: string, colIndex: number, size: number) => void,
  addRow: () => void,
  fontSize: () => number
) {
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
}

export function getTextTable(
  layoutItem: LayoutItem,
  updateItem: (id: string, field: string, value: string) => void,
  removeItem: (id: string, rowIndex: number, colIndex: number) => void,
  addItem: (id: string, rowIndex: number, value: string) => void,
  updateColSize: (id: string, colIndex: number, size: number) => void
) {
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

  const fontSize = (): number => {
    return defaultFontSize();
    //return Math.min((12 * itemSumSize(layoutItem, 0.4, 0.9, -0.5)), 24 * layoutItem.h);
  }

  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "text-table-content" : "text-table-content-notitle"}>
        {getItemTitle(layoutItem, updateItem, fontSize, "text-table-title")}
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
}