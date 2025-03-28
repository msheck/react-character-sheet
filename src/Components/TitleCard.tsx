import { LayoutItem } from "../Types";

function staticTitleCard(layoutItem: LayoutItem) {
  return (
    <>
      <h4>{layoutItem.title}</h4>
    </>
  );
}

function editableTitleCard(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
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

export function getTitleCard(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  return (
    <>
      <div className="item-content" id="title-card-content">
        {
          layoutItem.static
            ? staticTitleCard(layoutItem)
            : editableTitleCard(layoutItem, updateItem)
        }
      </div>
    </>
  );
}