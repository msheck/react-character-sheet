import { FunctionComponent, useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { LayoutItem, Layouts, Props } from "./Types";
import { useSheetFunctions } from "./SheetFunctions";
import { useDefaultColors } from "./DefaultColors";
import { saveToLS, setDefaultFontSize } from "./Utils";
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
  cols = { lg: 240, md: 240, sm: 240, xs: 240 },
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480 },
  containerPadding = { lg: [0, 0], md: [0, 0], sm: [0, 0], xs: [0, 0] },
  containerMargin = { lg: [5, 5], md: [4, 4], sm: [3, 3], xs: [2, 2] },
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
  const [currentBreakpoint, setCurrentBreakpoint] = useState<"lg" | "md" | "sm" | "xs">("lg");

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

  // Effect listener to manage breakpoints
  useEffect(() => {
    const resizeBuffer = 128;

    const getStableBreakpoint = (width: number): "lg" | "md" | "sm" | "xs" => {
      if (width >= breakpoints.lg + resizeBuffer) return "lg";
      else if (width >= breakpoints.md + resizeBuffer) return "md";
      else if (width >= breakpoints.sm + resizeBuffer) return "sm";
      else return "xs";
    };

    const applyBreakpointStyles = (breakpoint: "lg" | "md" | "sm" | "xs") => {
      const breakpointPercentages = {
        lg: ["75%", 10],
        md: ["80%", 8],
        sm: ["90%", 6],
        xs: ["100%", 5],
      };

      const newWidth = breakpointPercentages[breakpoint];
      document.documentElement.style.setProperty("--layout-width", newWidth[0] as string);
      setDefaultFontSize(newWidth[1] as number);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const stableBreakpoint = getStableBreakpoint(width);

      if (stableBreakpoint !== currentBreakpoint) {
        setCurrentBreakpoint(stableBreakpoint);
        applyBreakpointStyles(stableBreakpoint);
      }
    };

    // Apply styles immediately on mount
    const initialWidth = window.innerWidth;
    const initialBreakpoint = getStableBreakpoint(initialWidth);
    setCurrentBreakpoint(initialBreakpoint);
    applyBreakpointStyles(initialBreakpoint);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentBreakpoint]);

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
        margin={containerMargin}
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