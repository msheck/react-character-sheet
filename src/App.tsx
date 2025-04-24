import { FunctionComponent, useState, useEffect, useRef } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { v4 as uuidv4 } from "uuid";
import Moveable from "react-moveable";
import Selecto from "react-selecto"
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./styles.css";

interface LayoutItem {
  x: number;
  y: number;
  w: number;
  h: number;
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

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    saveToLS("layout", layouts.lg);
  }, [layouts]);

  useEffect(() => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.map((item) => ({
        ...item,
        static: !editMode,
        isDraggable: editMode,
      })),
    }));
  }, [editMode]);

  const handleLayoutChange = (_layout: LayoutItem[], updatedLayouts: Layouts) => {
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

  const addItem = () => {
    const newItem: LayoutItem = {
      x: 0,
      y: 0,
      w: 20,
      h: 12,
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

  const getSelectedElements = () => {
    return selectedIds.map(id => document.querySelector(`[data-id="${id}"]`)).filter(Boolean) as HTMLElement[];
  };

  const calculateNewPosition = (item: LayoutItem, dx: number, dy: number) => {
    const containerWidth = gridRef.current?.offsetWidth || 1;
    const colWidth = containerWidth / cols.lg;

    return {
      x: item.x + dx / colWidth,
      y: item.y + dy / rowHeight
    };
  };

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
            {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected
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
            keepRatio={false}
            throttleDrag={0}
            onClickGroup={(e) => {
              selectoRef.current?.clickTarget(e.inputEvent, e.inputTarget);
            }}
            onDrag={(e) => {
              e.target.style.transform = e.transform;
            }}
            onDragGroup={(e) => {
              e.events.forEach((ev) => {
                ev.target.style.transform = ev.transform;
              });
            }}
            onDragGroupEnd={(e) => {
              setLayouts((prevLayouts) => {
                const containerWidth = gridRef.current?.offsetWidth || 1;

                return {
                  lg: prevLayouts.lg.map((item) => {
                    if (!selectedIds.includes(item.i)) return item;

                    const element = document.querySelector(`[data-id="${item.i}"]`) as HTMLElement;
                    if (!element) return item;

                    // Calculate delta from transform
                    const transform = element.style.transform;
                    const matrix = new DOMMatrix(transform);
                    const dx = matrix.m41;
                    const dy = matrix.m42;

                    // Calculate new grid position
                    const newPos = calculateNewPosition(item, dx, dy);

                    // Reset transform for grid layout
                    element.style.transform = '';

                    return { ...item, x: Math.floor(newPos.x), y: Math.floor(newPos.y) };
                  })
                };
              });
            }}
          />
          <Selecto
            ref={selectoRef}
            dragContainer={".grid-container"}
            selectableTargets={[".react-grid-item"]}
            hitRate={0}
            selectByClick={true}
            selectFromInside={false}
            toggleContinueSelect={["shift"]}
            ratio={0}
            onDragStart={(e) => {
              const target = e.inputEvent.target;
              if (
                moveableRef.current?.isMoveableElement(target) ||
                getSelectedElements().some(t => t === target || t.contains(target))
              ) {
                e.stop();
              }
            }}
            onSelect={(e) => {
              setSelectedIds(e.selected.map(el => el.getAttribute("data-id") || ""));
            }}
            onSelectEnd={(e) => {
              if (e.isDragStartEnd) {
                e.inputEvent.preventDefault();
                moveableRef.current?.waitToChangeTarget().then(() => {
                  moveableRef.current?.dragStart(e.inputEvent);
                });
              }
              setSelectedIds(e.selected.map(el => el.getAttribute("data-id") || ""));
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