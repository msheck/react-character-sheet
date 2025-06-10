import { FunctionComponent, useState, useEffect, useRef, useCallback } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { v4 as uuidv4 } from "uuid";
import Moveable, { OnDrag, OnDragGroup } from "react-moveable";
import Selecto from "react-selecto";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./styles.css";

interface LayoutItem {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  i: string;
  static?: boolean;
  title?: string;
  description?: string;
}

interface Layouts {
  [key: string]: LayoutItem[];
}

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
  rowHeight = 2,
  onLayoutChange = () => { },
  cols = { lg: 240, md: 240, sm: 240, xs: 240 },
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480 },
  containerPadding = { lg: [0, 0], md: [0, 0], sm: [0, 0], xs: [0, 0] },
}) => {
  const [layouts, setLayouts] = useState<Layouts>({
    lg: getFromLS("layout") || [],
  });
  const [mounted, setMounted] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => saveToLS("layout", layouts.lg), [layouts]);

  useEffect(() => {
    setLayouts(prev => ({
      ...prev,
      lg: prev.lg.map(item => ({
        ...item,
        static: !editMode,
      })),
    }));
  }, [editMode]);

  const handleLayoutChange = (layout: LayoutItem[]) => {
    setLayouts(prev => ({ ...prev, lg: layout }));
    onLayoutChange(layout, layouts);
  };

  const addItem = () => {
    const newItem: LayoutItem = {
      x: 0,
      y: 0,
      w: 20,
      h: 12,
      minW: 20,
      minH: 12,
      i: uuidv4(),
      static: !editMode
    };
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: [...prevLayouts.lg, newItem],
    }));
  };

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
        item.i === id ? { ...item, static: !item.static } : item
      ),
    }));
  };

  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
    setSelectedIds([]);
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

  const handleDrag = (e: OnDrag) => {
    dragHandler([e]);
  };

  const handleDragGroup = (e: OnDragGroup) => {
    dragHandler(e.events);
  };

  const dragHandler = (events: OnDrag[]) => {
    const { width, colCount } = getGridInfo();
    const gridUnitWidth = width / colCount;

    setLayouts(prev => {
      const updatedLg = prev.lg.map(item => {
        const idx = selectedIds.indexOf(item.i);
        if (idx !== -1 && events[idx] && !item.static) {
          return {
            ...item,
            x: Math.max(0, Math.floor(events[idx].beforeTranslate[0] / gridUnitWidth)),
            y: Math.max(0, Math.floor(events[idx].beforeTranslate[1] / (rowHeight * 3.5))),
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
    <div className="mb-4">
      <div className="buttons">
        <button className="edit-mode" onClick={toggleEditMode}>
          {editMode ? "Save" : "Edit"}
        </button>

        {editMode && (
          <>
            <button className="add-button" onClick={addItem}>
              Add Element
            </button>
            <div className="selection-info">
              {selectedIds.length} selected
            </div>
          </>
        )}
      </div>

      <div ref={gridRef} className="grid-container">
        <ResponsiveReactGridLayout
          className={className}
          rowHeight={rowHeight}
          cols={cols}
          breakpoints={breakpoints}
          containerPadding={containerPadding}
          margin={{ lg: [5, 5], md: [4, 4], sm: [3, 3], xs: [2, 2] }}
          compactType={null}
          layouts={layouts}
          measureBeforeMount={false}
          useCSSTransforms={mounted}
          onLayoutChange={handleLayoutChange}
          isResizable={editMode}
          preventCollision={true}
        >
          {layouts.lg.map((layoutItem) => (
            <div
              key={layoutItem.i}
              className={`grid-item ${selectedIds.includes(layoutItem.i) ? "selected" : ""}`}
              data-id={layoutItem.i}
            >
              {editMode && (
                <>
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
            selectByClick
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