import { LayoutItem } from "../Types";
import { hasTitle } from "../Utils";

function staticTextBox(layoutItem: LayoutItem) {
  return (
    <>
      {(hasTitle(layoutItem)) && <h4>{layoutItem.title}</h4>}
      <p>{layoutItem.data?.at(0)}</p>
    </>
  );
}

function editableTextBox(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  return (
    <>
      <input
        type="text"
        value={layoutItem.title}
        onChange={(e) => updateItem(layoutItem.i, "title", e.target.value)}
        placeholder="Title" />
      <textarea
        value={layoutItem.data?.at(0)}
        onChange={(e) => updateItem(layoutItem.i, "data-0", e.target.value)}
        placeholder="Description" />
    </>
  );
}

export function getTextBox(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "text-box-content" : "text-box-content-notitle"}>
        {
          layoutItem.static
            ? staticTextBox(layoutItem)
            : editableTextBox(layoutItem, updateItem)
        }
      </div>
    </>
  );
}