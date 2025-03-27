import { LayoutItem } from "./Types";

function GridItem(
  layoutItem: LayoutItem,
  editMode: boolean,
  onPutItem: (item: LayoutItem) => void,
  allowEditItem: (id: string) => void,
  updateItem: (id: string, field: string, value: string) => void) {
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
        {layoutItem.static ? (
          <>
            <h4>{layoutItem.title}</h4>
            <p>{layoutItem.description}</p>
          </>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default GridItem;
