import { FunctionComponent, useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { LayoutItem, Layouts, Props } from "./Types";
import ToolBox from "./ToolBox";
import { saveToLS } from "./Utils";
import { useSheetFunctions } from "./SheetFunctions";
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
  const {
    layouts,
    toolbox,
    editMode,
    addItem,
    onTakeItem,
    onPutItem,
    onRemoveToolboxItem,
    updateItem,
    allowEditItem,
    toggleEditMode,
    setLayouts,
  } = useSheetFunctions();

  const [mounted, setMounted] = useState(false);

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