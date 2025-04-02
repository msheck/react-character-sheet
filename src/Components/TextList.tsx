import { LayoutItem } from "../Types";
import { hasTitle } from "../Utils";

function renderListItem(
  layoutItem: LayoutItem,
  updateItem: (id: string, field: string, value: string) => void,
  removeItem: (id: string, index: number) => void,
  addItem: (id: string, value: string) => void
) {
  return (
    <ul id="text-list-unordered-list">
      {layoutItem.data?.map((value, index) => (
        <li key={index} id="text-list-item">
          <textarea id="text-list-item-input"
            className={layoutItem.data?.length === index + 1 ? "focus-item-" + layoutItem.i : ""}
            value={value}
            onChange={(e) => updateItem(layoutItem.i, "data-" + index, e.target.value)}
            placeholder="New Item" />
          <span hidden={layoutItem.static} className="remove-button" id="text-list-item-remove" onClick={() => removeItem(layoutItem.i, index)}>&times;</span>
        </li>
      ))}
      {layoutItem.static ? null : renderAddItem(layoutItem, addItem)}
    </ul>
  )
}

function renderAddItem(
  layoutItem: LayoutItem,
  addItem: (id: string, value: string) => void
) {
  return (
    <li id="text-list-item">
      <textarea className="text-list-add-item-area" id="text-list-item-input"
        value=""
        onChange={(e) => {
          e.stopPropagation();
          addItem(layoutItem.i, e.target.value);
          setTimeout(() => {
            const newItem = document.getElementsByClassName("focus-item-" + layoutItem.i)[0] as HTMLTextAreaElement;
            if (newItem) {
              newItem.focus(); // Set focus to the new item
              newItem.setSelectionRange(newItem.value.length, newItem.value.length); // Set cursor to the end
            }
          }, 0);
        }}
        placeholder="Add New Item" />
    </li>
  )
}

function staticTextList(
  layoutItem: LayoutItem,
  updateItem: (id: string, field: string, value: string) => void,
  removeItem: (id: string, index: number) => void,
  addItem: (id: string, value: string) => void
) {
  return (
    <>
      {(hasTitle(layoutItem)) && <h4 id="text-list-title">{layoutItem.title}</h4>}
      {renderListItem(layoutItem, updateItem, removeItem, addItem)}
    </>
  );
}

function editableTextList(
  layoutItem: LayoutItem,
  updateItem: (id: string, field: string, value: string) => void,
  removeItem: (id: string, index: number) => void,
  addItem: (id: string, value: string) => void
) {
  return (
    <>
      <input id="text-list-title"
        type="text"
        value={layoutItem.title}
        onChange={(e) => updateItem(layoutItem.i, "title", e.target.value)}
        placeholder="Title" />
      {renderListItem(layoutItem, updateItem, removeItem, addItem)}
    </>
  );
}

export function getTextList(
  layoutItem: LayoutItem,
  updateItem: (id: string, field: string, value: string) => void,
  removeItem: (id: string, index: number) => void,
  addItem: (id: string, value: string) => void
) {
  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "text-list-content" : "text-list-content-notitle"}>
        {
          layoutItem.static
            ? staticTextList(layoutItem, updateItem, removeItem, addItem)
            : editableTextList(layoutItem, updateItem, removeItem, addItem)
        }
      </div>
    </>
  );
}