import { LayoutItem } from "../Types";
import { getTitleCard } from "./TitleCard";
import { getTextBox } from "./TextBox";
import { getAttributeCounter } from "./AttributeCounter";

function GridItem(
  layoutItem: LayoutItem,
  editMode: boolean,
  onPutItem: (item: LayoutItem) => void,
  allowEditItem: (id: string) => void,
  updateItem: (id: string, field: string, value: string) => void
) {
  return (
    <div key={layoutItem.i} className="grid-item">
      {editMode && (
        <>
          <span className="remove-button" onClick={() => onPutItem(layoutItem)}>
            &times;
          </span>
          <span className="edit-button" onClick={() => allowEditItem(layoutItem.i)}>
            <small>&#9998;</small>
          </span>
        </>
      )}
      {getItemContent(layoutItem, updateItem)}
    </div>
  );
}

function getItemContent(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  switch (layoutItem.i.split('#')[0]) {
    case 'title-card':
      return getTitleCard(layoutItem, updateItem);
    case 'text-box':
      return getTextBox(layoutItem, updateItem)
    case 'attribute-counter':
      return getAttributeCounter(layoutItem, updateItem);
    default:
      return null;
  }
}

export default GridItem;
