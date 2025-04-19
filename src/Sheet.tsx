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
  rowHeight = 2,
  onLayoutChange = () => { },
  cols = { lg: 240, md: 240, sm: 240, xs: 240, xxs: 240 },
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  containerPadding = { lg: [0, 0], md: [0, 0], sm: [0, 0], xs: [0, 0], xss: [0, 0] },
  containerMargin = { lg: [5, 5], md: [4, 4], sm: [3, 3], xs: [2, 2], xss: [1, 1] },
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
        static: !editMode || item.isLocked, // Set static to true in view mode, false in edit mode if item is not locked
        isDraggable: editMode && !item.isLocked, // Set isDraggable to the inverse of static logic
      })),
    }));
  }, [editMode]);

  // Set --layout-width on app mount based on initial page width
  useEffect(() => {
    const initialWidth = window.innerWidth;

    let initialBreakpoint: "lg" | "md" | "sm" | "xs" | "xxs" = "xxs";
    if (initialWidth >= 1200) {
      initialBreakpoint = "lg";
    } else if (initialWidth >= 996) {
      initialBreakpoint = "md";
    } else if (initialWidth >= 768) {
      initialBreakpoint = "sm";
    } else if (initialWidth >= 480) {
      initialBreakpoint = "xs";
    }

    handleBreakpointChange(initialBreakpoint);
  }, []);

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

  const handleBreakpointChange = (newBreakpoint: "lg" | "md" | "sm" | "xs" | "xxs") => {
    const breakpointPercentages = {
      lg: "75%",
      md: "80%",
      sm: "90%",
      xs: "100%",
      xxs: "100%",
    };
    const newWidth = breakpointPercentages[newBreakpoint];
    document.documentElement.style.setProperty("--layout-width", newWidth);
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
        margin={containerMargin}
        verticalCompact={verticalCompact}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
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