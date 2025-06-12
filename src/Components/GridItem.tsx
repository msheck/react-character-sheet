import { LayoutItem } from "../Types";
import { getTitleCard } from "./TitleCard";
import { getTextField } from "./TextField";
import { getTextBox } from "./TextBox";
import { getAttributeCounter } from "./AttributeCounter";
import { getStatPool } from "./StatPool";
import { getTextList } from "./TextList";
import { getTextTable } from "./TextTable";
import { getMathFormula } from "./MathFormula";

// Basic GridItem component, renders the remove and edit buttons, gets content by type
function GridItem(
  layoutItem: LayoutItem,
  selectedIds: string[],
  editMode: boolean,
  onPutItem: (item: LayoutItem) => void,
  lockItem: (id: string) => void,
  updateItem: (id: string, field: string, value: string) => void,
  removeItem: (id: string, rowIndex: number, colIndex: number) => void,
  addItem: (id: string, rowIndex: number, value: string) => void,
  updateColSize: (id: string, colIndex: number, size: number) => void
) {
  return (
    <div
      key={layoutItem.i}
      id={layoutItem.type}
      className={`grid-item ${selectedIds.includes(layoutItem.i) ? "selected" : ""}`}
      data-id={layoutItem.i}
    >
      {editMode && (
        <>
          <div id="remove-grid-item" className="remove-button" onMouseDown={(e) => { e.stopPropagation(); onPutItem(layoutItem) }}>
            <span className="button-text">&times;</span>
          </div>
          <div id="edit-grid-item" className="edit-button" onMouseDown={(e) => { e.stopPropagation(); lockItem(layoutItem.i) }}>
            <span className="button-text">&#9998;</span>
          </div>
        </>
      )}
      {getItemContent(layoutItem, updateItem, removeItem, addItem, updateColSize)}
    </div>
  );
}

// Get content by one of the types defined in the ToolboxTemplates
function getItemContent(
  layoutItem: LayoutItem,
  updateItem: (id: string, field: string, value: string) => void,
  removeItem: (id: string, rowIndex: number, colIndex: number) => void,
  addItem: (id: string, rowIndex: number, value: string) => void,
  updateColSize: (id: string, colIndex: number, size: number) => void
) {
  switch (layoutItem.type) {
    case 'title-card':
      return getTitleCard(layoutItem, updateItem);
    case 'text-field':
      return getTextField(layoutItem, updateItem);
    case 'text-box':
      return getTextBox(layoutItem, updateItem)
    case 'attribute-counter':
      return getAttributeCounter(layoutItem, updateItem);
    case 'stat-pool':
      return getStatPool(layoutItem, updateItem);
    case 'text-list':
      return getTextList(layoutItem, updateItem, removeItem, addItem);
    case 'text-table':
      return getTextTable(layoutItem, updateItem, removeItem, addItem, updateColSize);
    case 'math-formula':
      return getMathFormula(layoutItem, updateItem);
    default:
      return null;
  }
}

export default GridItem;
