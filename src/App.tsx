import { FunctionComponent, useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { v4 as uuidv4 } from "uuid"; // Unique ID generator
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./styles.css";

// Define types for layout items
interface LayoutItem {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
  static?: boolean;
  isDraggable?: boolean;
}

interface Layouts {
  [key: string]: LayoutItem[];
}

// Props for ToolBoxItem
interface ToolBoxItemProps {
  item: LayoutItem;
  onTakeItem: (item: LayoutItem) => void;
  onRemoveItem: (item: LayoutItem) => void;
}

// ToolBoxItem Component
const ToolBoxItem: FunctionComponent<ToolBoxItemProps> = ({
  item,
  onTakeItem,
  onRemoveItem,
}) => {
  return (
    <div className="toolbox__items__item">
      <span onClick={() => onTakeItem(item)}>{item.i}</span>
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the onTakeItem event
          onRemoveItem(item);
        }}
      >
        &times;
      </button>
    </div>
  );
};

// Props for ToolBox
interface ToolBoxProps {
  items: LayoutItem[];
  onTakeItem: (item: LayoutItem) => void;
  onRemoveItem: (item: LayoutItem) => void;
}

// ToolBox Component
const ToolBox: FunctionComponent<ToolBoxProps> = ({
  items,
  onTakeItem,
  onRemoveItem,
}) => {
  return (
    <div className="toolbox">
      <h4 className="toolbox__title">Toolbox</h4>
      <div className="toolbox__items">
        {items.map((item) => (
          <ToolBoxItem
            key={item.i}
            item={item}
            onTakeItem={onTakeItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </div>
  );
};

// Props for DropDrag
interface Props {
  className?: string;
  rowHeight?: number;
  onLayoutChange?: (layout: LayoutItem[], layouts: Layouts) => void;
  cols?: { [key: string]: number };
  breakpoints?: { [key: string]: number };
  containerPadding?: [number, number] | { [key: string]: [number, number] };
  verticalCompact?: boolean;
}

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const DropDrag: FunctionComponent<Props> = ({
  className = "layout",
  rowHeight = 30,
  onLayoutChange = () => {},
  cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  containerPadding = [0, 0],
  verticalCompact = false,
}) => {
  const [layouts, setLayouts] = useState<Layouts>({
    lg: getFromLS("layout") || [],
  });

  const [toolbox, setToolbox] = useState<Layouts>({
    lg: getFromLS("toolbox") || [
      { x: 0, y: 0, w: 2, h: 2, i: "toolbox-item-1" },
      { x: 0, y: 0, w: 2, h: 2, i: "toolbox-item-2" },
    ],
  });

  const [mounted, setMounted] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => setMounted(true), []);

  // Save both layouts and toolbox items to localStorage whenever they change
  useEffect(() => {
    saveToLS("layout", layouts.lg);
  }, [layouts]);

  useEffect(() => {
    saveToLS("toolbox", toolbox.lg);
  }, [toolbox]);

  // Update the static and isDraggable properties of layout items based on editMode
  useEffect(() => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.map((item) => ({
        ...item,
        static: !editMode, // Set static to true in view mode, false in edit mode
        isDraggable: editMode, // Set isDraggable to the inverse of static
      })),
    }));
  }, [editMode]);

  const handleLayoutChange = (_layout: LayoutItem[], updatedLayouts: Layouts) => {
    setLayouts(updatedLayouts);
    onLayoutChange(_layout, updatedLayouts);
  };

  // Function to add a new element with a unique ID
  const addItem = () => {
    const newItem: LayoutItem = {
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      i: uuidv4(),
      static: !editMode,
      isDraggable: editMode,
    };
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: [...prevLayouts.lg, newItem],
    }));
  };

  // Function to remove an element from the grid
  const removeItem = (id: string) => {
    setLayouts((prevLayouts) => {
      const updatedLayout = prevLayouts.lg.filter((item) => item.i !== id);
      return { ...prevLayouts, lg: updatedLayout };
    });
  };

  // Function to move an item from the toolbox to the grid
  const onTakeItem = (item: LayoutItem) => {
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      lg: prevToolbox.lg.filter(({ i }) => i !== item.i),
    }));
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: [...prevLayouts.lg, { ...item, static: !editMode, isDraggable: editMode }], // Set static and isDraggable based on editMode
    }));
  };

  // Function to move an item from the grid back to the toolbox
  const onPutItem = (item: LayoutItem) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.filter(({ i }) => i !== item.i),
    }));
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      lg: [...prevToolbox.lg, item],
    }));
  };

  // Function to remove an item from the toolbox
  const onRemoveToolboxItem = (item: LayoutItem) => {
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      lg: prevToolbox.lg.filter(({ i }) => i !== item.i),
    }));
  };

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  return (
    <div className="mb-4">
      <button className="edit-button" onClick={toggleEditMode}>
        {editMode ? "Save" : "Edit"}
      </button>

      {editMode && ( // Show Add Element button and Toolbox only in edit mode
        <>
          <button className="add-button" onClick={addItem}>
            Add Element
          </button>
          <ToolBox
            items={toolbox.lg}
            onTakeItem={onTakeItem}
            onRemoveItem={onRemoveToolboxItem}
          />
        </>
      )}

      <ResponsiveReactGridLayout
        className={className}
        rowHeight={rowHeight}
        cols={cols}
        breakpoints={breakpoints}
        containerPadding={containerPadding}
        verticalCompact={verticalCompact}
        layouts={layouts}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        onLayoutChange={handleLayoutChange}
      >
        {layouts.lg.map((layoutItem) => (
          <div key={layoutItem.i} className="grid-item">
            {editMode && ( // Only show remove button in edit mode
              <span
                className="remove-button"
                onClick={() => onPutItem(layoutItem)}
              >
                &times;
              </span>
            )}
            <span className="item-content">{layoutItem.i}</span>
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </div>
  );
};

// Utility functions for localStorage
function getFromLS(key: string): LayoutItem[] {
  let ls: { [key: string]: LayoutItem[] } = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-7") || "{}");
    } catch (e) {
      console.error("Failed to parse localStorage data:", e);
    }
  }
  return ls[key] || [];
}

function saveToLS(key: string, value: LayoutItem[]): void {
  if (global.localStorage) {
    try {
      const existingData = JSON.parse(global.localStorage.getItem("rgl-7") || "{}");
      existingData[key] = value;
      global.localStorage.setItem("rgl-7", JSON.stringify(existingData));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }
}

export default DropDrag;