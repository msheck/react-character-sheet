import { FunctionComponent, useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { v4 as uuidv4 } from "uuid"; // Unique ID generator
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./styles.css";

// Define types for layout items and layouts
interface LayoutItem {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
}

interface Layouts {
  [key: string]: LayoutItem[];
}

// Define props for the DropDrag component
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
  rowHeight = 30,
  onLayoutChange = () => {},
  cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  containerPadding = [0, 0],
  verticalCompact = false,
}) => {
  const [layouts, setLayouts] = useState<Layouts>({
    lg: getFromLS("layout") || [],
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLayoutChange = (_layout: LayoutItem[], updatedLayouts: Layouts) => {
    saveToLS("layout", _layout);
    setLayouts(updatedLayouts);
    onLayoutChange(_layout, updatedLayouts);
  };

  // Function to add a new element with a unique ID
  const addItem = () => {
    const newItem: LayoutItem = {
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      i: uuidv4(), // Use a unique ID to prevent key conflicts
    };
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: [...prevLayouts.lg, newItem],
    }));
  };

  // Function to remove an element
  const removeItem = (id: string) => {
    setLayouts((prevLayouts) => {
      const updatedLayout = prevLayouts.lg.filter((item) => item.i !== id);
      return { ...prevLayouts, lg: updatedLayout };
    });
  };

  return (
    <div className="mb-4">
      <button className="add-button" onClick={addItem} aria-label="Add Element">Add Element</button>
      <ResponsiveReactGridLayout
        className={className}
        rowHeight={rowHeight}
        cols={cols}
        breakpoints={breakpoints}
        containerPadding={containerPadding}
        verticalCompact={verticalCompact}
        layouts={layouts}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        onLayoutChange={handleLayoutChange}
        isDroppable
      >
        {layouts.lg.map((layoutItem) => (
          <div key={layoutItem.i} className="grid-item">
            <span className="remove-button" onClick={() => removeItem(layoutItem.i)} aria-label="Remove Element">&times;</span>
            <span className="item-content">{layoutItem.i}</span>
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </div>
  );
};

// Utility functions for localStorage
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