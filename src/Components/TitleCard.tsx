import { LayoutItem } from "../Types";
import { itemSumSize } from "../Utils";

function staticTitleCard(layoutItem: LayoutItem) {
  return (
    <>
      <h4 style={{ fontSize: 15 * itemSumSize(layoutItem, 0.3, 1, -0.5) }}>{layoutItem.title}</h4>
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