import { FunctionComponent, useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { LayoutItem, Layouts, Props } from "./Types";
import { useSheetFunctions } from "./SheetFunctions";
import { useDefaultColors } from "./DefaultColors";
import { saveToLS } from "./Utils";
import Toolbox from "./Toolbox";
import GridItem from "./Components/GridItem";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./Styles/Global.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const DropDrag: FunctionComponent<Props> = ({
  className = "layout",
  rowHeight = 30,
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
    onTakeItem,
    onPutItem,
    onRemoveToolboxItem,
    updateItem,
    removeItem,
    addItem,
    updateColSize,
    lockItem,
    toggleEditMode,
    setLayouts,
  } = useSheetFunctions();

  // Ensure that colors are loaded from localStorage before opening the Toolbox
  const { defaultColors } = useDefaultColors();

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
        isLocked: item.isLocked,
        static: !editMode || item.isLocked, // Set static to true in view mode, false in edit mode
        isDraggable: editMode && !item.isLocked, // Set isDraggable to the inverse of static
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
        data: existingItem?.data ?? [[]],
        label: existingItem?.label,
        type: existingItem?.type,
        isLocked: existingItem?.isLocked ?? false,
        colSizes: existingItem?.colSizes ?? [],
      };
    });

    setLayouts({ lg: mergedLayout });
    onLayoutChange(_layout, updatedLayouts);
  };

  return (
    <div className="sheet">
      <button className="edit-mode" onClick={toggleEditMode}>
        {editMode ? "Save" : "Edit"}
      </button>

      {editMode && ( // Show Add Element button and Toolbox only in edit mode
        <>
          <Toolbox
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
        preventCollision={true}
      >
        {layouts.lg.map((layoutItem) => (
          GridItem(layoutItem, editMode, onPutItem, lockItem, updateItem, removeItem, addItem, updateColSize)
        ))}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default DropDrag;