import { LayoutItem } from "../Types";
import { getDefaultFontSize, getItemTitle, hasTitle, itemSumSize, useCommandCall } from "../Utils";

function renderAddItem(
  layoutItem: LayoutItem,
  addItem: (id: string, rowIndex: number, value: string) => void,
  fontSize: (offset: number) => number
) {
  return (
    <textarea
      className="text-list-add-item-area"
      id="text-list-item-input"
      value=""
      placeholder="Add New Item"
      style={{ fontSize: fontSize(0) }}
      onChange={(e) => {
        e.stopPropagation();
        addItem(layoutItem.i, 0, e.target.value);
        setTimeout(() => {
          const newItem = document.getElementsByClassName("focus-item-" + layoutItem.i)[0] as HTMLTextAreaElement;
          if (newItem) {
            newItem.focus(); // Set focus to the new item
            newItem.setSelectionRange(newItem.value.length, newItem.value.length); // Set cursor to the end
          }
        }, 0);
      }}
    />
  )
}

function renderListItem(
  layoutItem: LayoutItem,
  updateItem: (id: string, field: string, value: string) => void,
  removeItem: (id: string, rowIndex: number, colIndex: number) => void,
  addItem: (id: string, rowIndex: number, value: string) => void,
  fontSize: (offset: number) => number
) {
  return (
    <>
      <ul id="text-list-unordered-list">
        {
          layoutItem.data?.at(0)?.map((value, index) => (
            <li key={index} id="text-list-item">
              { // Renders a Checkbox or Textarea
                useCommandCall(layoutItem, value, index, undefined, updateItem, fontSize(-2), false, "text-list-item-data", (layoutItem.data?.at(0)?.length === index + 1 ? "focus-item-" + layoutItem.i : ""))
              }
              {!layoutItem.isLocked &&
                <div
                  id="text-list-item-remove"
                  className="remove-button"
                  onMouseDown={
                    (e) => {
                      e.stopPropagation();
                      removeItem(layoutItem.i, 0, index);
                    }}
                >
                  <span>&times;</span>
                </div>
              }
            </li>
          ))
        }
        {layoutItem.isLocked ? null : renderAddItem(layoutItem, addItem, fontSize)}
      </ul>
    </>
  )
}

export function getTextList(
  layoutItem: LayoutItem,
  updateItem: (id: string, field: string, value: string) => void,
  removeItem: (id: string, rowIndex: number, colIndex: number) => void,
  addItem: (id: string, rowIndex: number, value: string) => void
) {
  const fontSize = (offset: number = 0): number => {
    return Math.min((getDefaultFontSize() * itemSumSize(layoutItem, 0.1, 0.4, 0.8)), getDefaultFontSize() + 4) + offset;
  }

  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "text-list-content" : "text-list-content-notitle"}>
        {getItemTitle(layoutItem, updateItem, fontSize(), "text-list-title")}
        {renderListItem(layoutItem, updateItem, removeItem, addItem, fontSize)}
      </div>
    </>
  );
}