import { FunctionComponent, useState, useEffect, useRef } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { v4 as uuidv4 } from "uuid";
import Selecto from "react-selecto";
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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const selectoRef = useRef<Selecto>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridLayoutRef = useRef<any>(null);
  const isDragging = useRef(false);

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
    if (isDragging.current) return;

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
    setSelectedItems([]);
  };

  const moveSelectedItems = (dx: number, dy: number) => {
    if (selectedItems.length === 0) return;

    setLayouts((prevLayouts) => {
      const newLayout = prevLayouts.lg.map((item) => {
        if (selectedItems.includes(item.i)) {
          const newX = item.x + dx;
          const newY = item.y + dy;

          return { ...item, x: newX, y: newY };
        }
        return item;
      });
      return { lg: newLayout };
    });
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
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
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
          isDraggable={false} // Disable react-grid-layout's dragging since we're using Selecto
          isResizable={editMode}
          preventCollision={true}
        >
          {layouts.lg.map((layoutItem) => (
            <div
              key={layoutItem.i}
              className={`grid-item ${selectedItems.includes(layoutItem.i) ? "selected" : ""}`}
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
        <Selecto
          ref={selectoRef}
          dragContainer={".grid-container"}
          selectableTargets={[".react-grid-item"]}
          hitRate={10}
          selectByClick={true}
          selectFromInside={true}
          toggleContinueSelect={["shift"]}
          ratio={0}
          onSelect={(e) => {
            setSelectedItems(e.selected.map(el => el.getAttribute("data-id") || ""));
          }}
          onDragStart={(e) => {
            const target = e.inputEvent.target;

            // Prevent dragging if the target is an interactive element
            if (
              target.tagName === "BUTTON" ||
              target.tagName === "INPUT" ||
              target.tagName === "TEXTAREA" ||
              target.tagName === "SPAN"
            ) {
              return false;
            }

            // Check if the drag starts on an already selected item
            const itemId = target.getAttribute("data-id");
            if (itemId && selectedItems.includes(itemId)) {
              isDragging.current = true; // Allow dragging of selected items
              return true;
            }

            isDragging.current = false; // Prevent moving items during selection
            return true; // Allow Selecto to proceed
          }}
          onDrag={(e) => {
            if (isDragging.current && selectedItems.length > 0) {
              const containerWidth = gridRef.current?.offsetWidth || 1;
              const dx = e.deltaX / containerWidth * cols.lg; // Round to nearest integer
              const dy = e.deltaY / rowHeight; // Round to nearest integer

              console.log("Moving items:", selectedItems, "dx:", dx, "dy:", dy);

              moveSelectedItems(dx, dy);
            }
          }}
          onDragEnd={() => {
            isDragging.current = false;
            setLayouts((prevLayouts) => {
              const newLayout = prevLayouts.lg.map((item) => {
                if (selectedItems.includes(item.i)) {
                  return { ...item, x: Math.floor(item.x), y: Math.floor(item.y) };
                }
                return item;
              });
              return { lg: newLayout };
            });
          }}
        />
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