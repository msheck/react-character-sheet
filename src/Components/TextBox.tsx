import { LayoutItem } from "../Types";

function staticTextBox(layoutItem: LayoutItem) {
  return (
    <>
      <h4>{layoutItem.title}</h4>
      <p>{layoutItem.description}</p>
    </>
  );
}

function editableTextBox(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  return (
    <>
      <input
        type="text"
        value={layoutItem.title || ""}
        onChange={(e) => updateItem(layoutItem.i, "title", e.target.value)}
        placeholder="Title" />
      <textarea
        value={layoutItem.description || ""}
        onChange={(e) => updateItem(layoutItem.i, "description", e.target.value)}
        placeholder="Description" />
    </>
  );
}

export function getTextBox(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  return layoutItem.static
    ? staticTextBox(layoutItem)
    : editableTextBox(layoutItem, updateItem);
}