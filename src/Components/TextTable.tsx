import { LayoutItem } from "../Types";
import { hasTitle } from "../Utils";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

function defaultColSize(layoutItem: LayoutItem) {
  return Math.floor(((74.75 * layoutItem.w) - 35 + layoutItem.w * 5) / (layoutItem.data?.at(0)?.length ?? 1));
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

  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "text-table-content" : "text-table-content-notitle"}>
        {
          layoutItem.static ?
            <>
              {(hasTitle(layoutItem)) && <h4 id="text-table-title">{layoutItem.title}</h4>}
            </> : <>
              <input id="text-table-title"
                type="text"
                value={layoutItem.title}
                onChange={(e) => updateItem(layoutItem.i, "title", e.target.value)}
                placeholder="Title" />
            </>
        }
        <div id="text-table-table-div">
          <table id="text-table-table">
            {!(layoutItem.static && layoutItem.data?.at(0)?.every(d => d == "")) && // Only show header if not static and not empty
              <thead id="text-table-header">
                <tr>
                  {layoutItem.data?.at(0)?.map((header: string, index: number) => ( // Header row
                    <th id="text-table-cell" key={index} scope="col">
                      <div id="text-table-cell-headcontent">
                        <ResizableBox
                          width={layoutItem.colSizes?.[index] || defaultColSize(layoutItem)}
                          axis="x"
                          resizeHandles={['e']}
                          onResizeStop={(e, data) => updateColSize(layoutItem.i, index, data.size.width)}
                        >
                          <input id="text-table-header-input" // Header input
                            type="text"
                            value={header}
                            onChange={(e) => updateItem(layoutItem.i, "data-" + 0 + "-" + index, e.target.value)}
                          />
                          {!layoutItem.static && // Only show add/remove buttons if not static
                            <div id="buttons-case">
                              {layoutItem.data?.at(0)?.length === index + 1 &&
                                <span id="text-table-add-column"
                                  className="add-button"
                                  onMouseDown={addColumn}
                                >
                                  &#43;
                                </span>
                              }
                              {layoutItem.data?.at(0)?.length !== 1 && // Only show remove button if more than one column
                                <span id="text-table-remove-col"
                                  className="remove-button"
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    layoutItem.data?.forEach((_, rowIndex) => removeItem(layoutItem.i, rowIndex, index))
                                  }}
                                >
                                  &times;
                                </span>
                              }
                            </div>
                          }
                        </ResizableBox>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
            }
            <tbody id="text-table-body">
              {layoutItem.data?.map((row: string[], rowIndex: number) => ( // Body rows
                rowIndex === 0 ? null : // Skip the header row
                  <tr key={rowIndex}>
                    {row.map((cell: string, colIndex: number) => ( // Body cells
                      <td id="text-table-cell" key={colIndex} style={{ width: (layoutItem.colSizes?.[colIndex] || defaultColSize(layoutItem)) }}>
                        <ResizableBox
                          width={layoutItem.colSizes?.[colIndex] || defaultColSize(layoutItem)}
                          axis="x"
                          resizeHandles={['e']}
                          onResizeStop={(e, data) => updateColSize(layoutItem.i, colIndex, data.size.width)}
                        >
                          <div id={layoutItem.static ? "text-table-cell-content" : "text-table-cell-content-on-edit"}>
                            {cell.startsWith("/checkbox") && layoutItem.static ?
                              <input id="text-table-checkbox" // Cell Checkbox
                                type="checkbox"
                                checked={cell === "/checkbox-checked"}
                                onChange={(e) => updateItem(layoutItem.i, "data-" + rowIndex + "-" + colIndex, e.target.checked ? "/checkbox-checked" : "/checkbox")}
                              />
                              :
                              <textarea id="text-table-cell-input" // Cell Textarea
                                value={cell}
                                onChange={(e) => updateItem(layoutItem.i, "data-" + rowIndex + "-" + colIndex, e.target.value)}
                              />
                            }
                            {!layoutItem.static && layoutItem.data?.at(rowIndex)?.length === colIndex + 1 && ( // Only show add/remove buttons if not static and is the last cell in the row
                              <div id="buttons-case">
                                {layoutItem.data?.length === rowIndex + 1 &&
                                  <span id="text-table-add-row"
                                    className="add-button"
                                    onMouseDown={addRow}
                                  >
                                    &#43;
                                  </span>
                                }
                                <div id="buttom-space" />
                                {layoutItem.data?.length > 2 && // Only show remove button if more than one row
                                  <span id="text-table-remove-row"
                                    className="remove-button"
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                      removeItem(layoutItem.i, rowIndex, -1)
                                    }}
                                  >
                                    &times;
                                  </span>
                                }
                              </div>
                            )}
                          </div>
                        </ResizableBox>
                      </td>
                    ))}
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}