import { LayoutItem } from "../Types";

function staticAttributeCounter(layoutItem: LayoutItem) {
  return (
    <>
      <h4><small>{layoutItem.title}</small></h4>
    </>
  );
}

function editableAttributeCounter(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  return (
    <>
      <input
        type="text"
        value={layoutItem.title}
        onChange={(e) => updateItem(layoutItem.i, "title", e.target.value)}
        placeholder="Title" />
    </>
  );
}

export function getAttributeCounter(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  return (
    <>
      <div className="item-content">
        {
          layoutItem.static
            ? staticAttributeCounter(layoutItem)
            : editableAttributeCounter(layoutItem, updateItem)
        }
        <input
          type="number"
          value={layoutItem.description}
          onChange={(e) => updateItem(layoutItem.i, "description", e.target.value)} />
      </div>
    </>
  );
}