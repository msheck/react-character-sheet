import { FunctionComponent, useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { v4 as uuidv4 } from "uuid"; // Unique ID generator
import { LayoutItem, Layouts, Props } from "./Types";
import ToolBox from "./ToolBox";
import { getFromLS, saveToLS } from "./Utils";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./Styles/Global.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const DropDrag: FunctionComponent<Props> = ({
  className = "layout",
  rowHeight = 60,
  onLayoutChange = () => { },
  cols = { lg: 24, md: 20, sm: 16, xs: 8, xxs: 4 },
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  containerPadding = [0, 0],
  verticalCompact = false,
}) => {
  const [layouts, setLayouts] = useState<Layouts>({
    lg: getFromLS("layout") || [],
  });

  const [toolbox, setToolbox] = useState<Layouts>({
    lg: getFromLS("toolbox").length === 0
      ? [
        { x: 0, y: 0, w: 2, h: 2, i: "toolbox-item-1", title: "Toolbox Item 1" },
        { x: 0, y: 0, w: 2, h: 2, i: "toolbox-item-2", title: "title" },
      ]
      : getFromLS("toolbox"),
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

  // Function to handle layout changes and preserve custom fields
  const handleLayoutChange = (_layout: LayoutItem[], updatedLayouts: Layouts) => {
    // Merge the new layout with the existing layout data to preserve custom fields
    const mergedLayout = _layout.map((newItem) => {
      const existingItem = layouts.lg.find((item) => item.i === newItem.i);
      return {
        ...newItem,
        title: existingItem?.title,
        description: existingItem?.description,
      };
    });

    setLayouts({ lg: mergedLayout });
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

  // Function to update the title or description of a grid item
  const updateItem = (id: string, field: "title" | "description", value: string) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.map((item) =>
        item.i === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const allowEditItem = (id: string) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.map((item) =>
        item.i === id ? { ...item, static: !item.static, isDraggable: !item.isDraggable } : item
      ),
    }));
  }

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  return (
    <div className="mb-4">
      <button className="edit-mode" onClick={toggleEditMode}>
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
        onLayoutChange={handleLayoutChange}
        layouts={layouts}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
      >
        {layouts.lg.map((layoutItem) => (
          <div key={layoutItem.i} className="grid-item">
            {editMode && ( // Only show remove button in edit mode
              <>
                <span
                  className="remove-button"
                  onClick={() => onPutItem(layoutItem)}
                >
                  &times;
                </span>
                <span
                  className="edit-button"
                  onClick={() => allowEditItem(layoutItem.i)}
                >
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
                    onChange={(e) =>
                      updateItem(layoutItem.i, "title", e.target.value)
                    }
                    placeholder="Title"
                  />
                  <textarea
                    value={layoutItem.description || ""}
                    onChange={(e) =>
                      updateItem(layoutItem.i, "description", e.target.value)
                    }
                    placeholder="Description"
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default DropDrag;