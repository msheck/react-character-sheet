import { FunctionComponent, useState, useEffect, useRef, useCallback } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { v4 as uuidv4 } from "uuid";
import Moveable from "react-moveable";
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
  isDraggable?: boolean;
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
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);  
  const moveableRef = useRef<Moveable>(null);
  const selectoRef = useRef<Selecto>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridLayoutRef = useRef<any>(null);
  
  const dragState = useRef<{
    initialPositions: Record<string, { x: number; y: number }>;
    containerRect?: DOMRect;
    colWidth: number;
  } | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => saveToLS("layout", layouts.lg), [layouts]);
  
  useEffect(() => {
    setLayouts(prev => ({
      ...prev,
      lg: prev.lg.map(item => ({
        ...item,
        static: !editMode,
        isDraggable: editMode,
      })),
    }));
  }, [editMode]);

  const calculateGridMetrics = useCallback(() => {
    const containerWidth = gridRef.current?.offsetWidth || 0;
    return {
      colWidth: containerWidth / cols.lg,
      containerRect: gridRef.current?.getBoundingClientRect(),
    };
  }, [cols.lg]);

  const handleDrag = useCallback((dx: number, dy: number) => {
    if (!dragState.current) return;

    const { colWidth, initialPositions } = dragState.current;
    const deltaX = dx / colWidth;
    const deltaY = dy / rowHeight;

    setLayouts(prev => ({
      lg: prev.lg.map(item => {
        if (!initialPositions[item.i]) return item;
        return {
          ...item,
          x: Math.ceil(initialPositions[item.i].x + deltaX),
          y: Math.ceil(initialPositions[item.i].y + deltaY),
        };
      })
    }));
  }, [rowHeight]);

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
      static: !editMode,
      isDraggable: editMode,
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
        item.i === id ? { ...item, static: !item.static, isDraggable: !item.isDraggable } : item
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

  return (
    <div className="mb-4">
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

      <div ref={gridRef} className="grid-container">
        <ResponsiveReactGridLayout
          ref={gridLayoutRef}
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
          isDraggable={false}
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
            ref={moveableRef}
            target={getSelectedElements()}
            draggable={true}
            resizable={false}
            throttleDrag={1}
            onDragStart={e => {
              dragState.current = {
                initialPositions: Object.fromEntries(
                  selectedIds.map(id => {
                    const item = layouts.lg.find(i => i.i === id)!;
                    return [id, { x: item.x, y: item.y }];
                  })
                ),
                ...calculateGridMetrics()
              };
            }}
            onDrag={e => {
              e.target.style.transform = e.transform;
              handleDrag(e.translate[0], e.translate[1]);
            }}
            onDragEnd={e => {
              e.target.style.transform = "";
              dragState.current = null;
            }}
            onDragGroupStart={e => {
              dragState.current = {
                initialPositions: Object.fromEntries(
                  selectedIds.map(id => {
                    const item = layouts.lg.find(i => i.i === id)!;
                    return [id, { x: item.x, y: item.y }];
                  })
                ),
                ...calculateGridMetrics()
              };
            }}
            onDragGroup={e => {
              e.events.forEach(ev => ev.target.style.transform = ev.transform);
              handleDrag(e.translate[0], e.translate[1]);
            }}
            onDragGroupEnd={e => {
              e.events.forEach(ev => ev.target.style.transform = "");
              dragState.current = null;
            }}
          />

          <Selecto
            ref={selectoRef}
            dragContainer=".grid-container"
            selectableTargets={[".grid-item"]}
            hitRate={80}
            selectByClick
            toggleContinueSelect={["shift"]}
            onSelect={e => {
              setSelectedIds(e.selected.map(el => el.getAttribute("data-id")!));
            }}
            onSelectEnd={e => {
              if (e.isDragStartEnd) {
                e.inputEvent.preventDefault();
                moveableRef.current?.dragStart(e.inputEvent);
              }
            }}
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