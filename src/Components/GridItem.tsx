import { LayoutItem } from "../Types";
import { getTitleCard } from "./TitleCard";
import { getTextBox } from "./TextBox";

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
      <div className="item-content">
        {getItemContent(layoutItem, updateItem)}
      </div>
    </div>
  );
}

function getItemContent(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  switch (layoutItem.i) {
    case 'title-card':
      return getTitleCard(layoutItem, updateItem);
    case 'text-box':
      return getTextBox(layoutItem, updateItem);
    default:
      return null;
  }
}

export default GridItem;
