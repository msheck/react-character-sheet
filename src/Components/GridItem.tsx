import { LayoutItem } from "../Types";
import TitleCard from "./TitleCard";
import TextField from "./TextField";
import TextBox from "./TextBox";
import AttributeCounter from "./AttributeCounter";
import StatPool from "./StatPool";
import TextList from "./TextList";
import TextTable from "./TextTable";
import MathFormula from "./MathFormula";
import ImageDisplay from "./ImageDisplay";

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
      return <TitleCard layoutItem={layoutItem} updateItem={updateItem} />;
    case 'text-field':
      return <TextField layoutItem={layoutItem} updateItem={updateItem} />;
    case 'text-box':
      return <TextBox layoutItem={layoutItem} updateItem={updateItem} />;
    case 'attribute-counter':
      return <AttributeCounter layoutItem={layoutItem} updateItem={updateItem} />;
    case 'stat-pool':
      return <StatPool layoutItem={layoutItem} updateItem={updateItem} />;
    case 'text-list':
      return <TextList layoutItem={layoutItem} updateItem={updateItem} removeItem={removeItem} addItem={addItem} />;
    case 'text-table':
      return <TextTable layoutItem={layoutItem} updateItem={updateItem} removeItem={removeItem} addItem={addItem} updateColSize={updateColSize} />;
    case 'math-formula':
      return <MathFormula layoutItem={layoutItem} updateItem={updateItem} />;
    case 'image-display':
      return <ImageDisplay layoutItem={layoutItem} updateItem={updateItem} />;
    default:
      return null;
  }
}

export default GridItem;
