import { FunctionComponent, useState, useEffect, useRef, useCallback } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import Moveable, { OnDrag, OnDragGroup } from "react-moveable";
import Selecto from "react-selecto";
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

  const { defaultColors } = useDefaultColors(); // Ensure that colors are loaded from localStorage before opening the Toolbox
  const [mounted, setMounted] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<"lg" | "md" | "sm" | "xs">("lg");
  const breakpointSets = {
    lg: ["75%", 10, 0.75, 5],
    md: ["80%", 8, 0.8, 4],
    sm: ["90%", 6, 0.9, 3],
    xs: ["100%", 5, 1, 2],
  };
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

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
      })),
    }));
  }, [editMode]);

  // Effect listener to manage breakpoints
  useEffect(() => {
    const resizeBuffer = 128;

    const getStableBreakpoint = (width: number): "lg" | "md" | "sm" | "xs" => {
      if (width >= breakpoints.lg + resizeBuffer) return "lg";
      if (width >= breakpoints.md + resizeBuffer) return "md";
      if (width >= breakpoints.sm + resizeBuffer) return "sm";
      return "xs";
    };

    const applyBreakpoint = (width: number) => {
      const breakpoint = getStableBreakpoint(width);
      if (breakpoint !== currentBreakpoint) {
        setCurrentBreakpoint(breakpoint);
      }
      const newValues = breakpointSets[breakpoint];
      document.documentElement.style.setProperty("--layout-width", newValues[0] as string);
      setDefaultFontSize(newValues[1] as number);
    };

    const handleResize = () => {
      applyBreakpoint(window.innerWidth);
    };

    // Apply styles immediately on mount
    applyBreakpoint(window.innerWidth);

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

  const getSelectedElements = useCallback(() =>
    selectedIds
      .map(id => document.querySelector(`[data-id="${id}"]`))
      .filter(Boolean) as HTMLElement[],
    [selectedIds]
  );

  // Handle for Selecto
  const handleSelect = (e: any) => {
    const ids = e.selected
      .map((el: HTMLElement) => el.getAttribute("data-id"))
      .filter(Boolean) as string[];
    // Filter out ids that are static
    const selectableIds = ids.filter(id => {
      const item = layouts.lg.find(item => item.i === id);
      return item && !item.static;
    });
    setSelectedIds(selectableIds);
  };

  // Helper to get grid width and col count
  const getGridInfo = () => {
    const gridElement = gridRef.current;
    if (!gridElement) return { width: 1, colCount: 1 };
    const width = gridElement.offsetWidth;
    const colCount = cols.lg || 1;
    return { width, colCount };
  };

  // Handle for Moveable drag events
  const handleDrag = (e: OnDrag) => {
    dragHandler([e]);
  };

  const handleDragGroup = (e: OnDragGroup) => {
    dragHandler(e.events);
  };

  const dragHandler = (events: OnDrag[]) => {
    const { width, colCount } = getGridInfo();
    const gridUnitWidth = width / colCount;
    const witdhPercentage = breakpointSets[currentBreakpoint][2] as number;
    const gridItemMarginOffset = 1 + (breakpointSets[currentBreakpoint][3] as number / 2);

    setLayouts(prev => {
      const updatedLg = prev.lg.map(item => {
        const idx = selectedIds.indexOf(item.i);
        if (idx !== -1 && events[idx] && !item.static) {
          return {
            ...item,
            x: Math.max(0, Math.floor((events[idx].beforeTranslate[0] / gridUnitWidth) / witdhPercentage)),
            y: Math.max(0, Math.floor(events[idx].beforeTranslate[1] / (rowHeight * gridItemMarginOffset))),
          };
        }
        return item;
      });
      return {
        ...prev,
        lg: updatedLg,
      };
    });
  };

  return (
    <div className="sheet">
      <button className="edit-mode" onClick={() => { toggleEditMode(); setSelectedIds([]); }}>
        {editMode ? "Save" : "Edit"}
      </button>

      {editMode && ( // Show Add Element button and Toolbox only in edit mode
        <Toolbox
          items={toolbox.lg}
          onTakeItem={onTakeItem}
          onRemoveItem={onRemoveToolboxItem}
        />
      )}

      <div ref={gridRef} className="grid-container">
        <ResponsiveReactGridLayout
          className={className}
          rowHeight={rowHeight}
          cols={cols}
          breakpoints={breakpoints}
          containerPadding={containerPadding}
          margin={containerMargin}
          compactType={null}
          layouts={layouts}
          measureBeforeMount={false}
          useCSSTransforms={mounted}
          onLayoutChange={handleLayoutChange}
          preventCollision={true}
        >
          {layouts.lg.map((layoutItem) => (
            GridItem(layoutItem, selectedIds, editMode, onPutItem, lockItem, updateItem, removeItem, addItem, updateColSize)
          ))}
        </ResponsiveReactGridLayout>
      </div>

      {editMode && (
        <>
          <Moveable
            target={getSelectedElements()}
            draggable={true}
            resizable={false}
            throttleDrag={1}
            onDrag={handleDrag}
            onDragGroup={handleDragGroup}
          />

          <Selecto
            dragContainer=".grid-container"
            selectableTargets={[".grid-item"]}
            hitRate={75}
            selectByClick={false}
            toggleContinueSelect={["shift"]}
            onSelect={handleSelect}
            preventDefault={true}
            selectFromInside={false}
          />
        </>
      )}
    </div>
  );
};

export default DropDrag;