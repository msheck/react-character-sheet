import { FunctionComponent, useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { v4 as uuidv4 } from 'uuid';  // Unique ID generator
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./styles.css";

interface Props {
  className?: string;
  rowHeight?: number;
  onLayoutChange?: (layout: any, layouts: any) => void;
  cols?: { [key: string]: number };
  breakpoints?: { [key: string]: number };
  containerPadding?: [number, number] | { [key: string]: [number, number] };
}

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const DropDrag: FunctionComponent<Props> = ({
  className = "layout",
  rowHeight = 30,
  onLayoutChange = () => {},
  cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  containerPadding = [0, 0],
}) => {
  const [layouts, setLayouts] = useState<{ [key: string]: any[] }>({
    lg: getFromLS("layout") || [],
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLayoutChange = (_layout: any, updatedLayouts: any) => {
    saveToLS("layout", _layout);
    setLayouts(updatedLayouts);
    onLayoutChange(_layout, updatedLayouts);
  };

  // Function to add a new element with unique ID
  const addItem = () => {
    const newItem = {
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
      <button className="add-button" onClick={addItem}>Add Element</button>
      <ResponsiveReactGridLayout
        className={className}
        rowHeight={rowHeight}
        cols={cols}
        breakpoints={breakpoints}
        containerPadding={containerPadding}
        layouts={layouts}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        onLayoutChange={handleLayoutChange}
        isDroppable
      >
        {layouts.lg.map((layoutItem) => (
          <div key={layoutItem.i} className="grid-item">
            <span className="remove-button" onClick={() => removeItem(layoutItem.i)}>&times;</span>
            <span className="item-content">{layoutItem.i}</span>
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </div>
  );
};

function getFromLS(key: string): any {
  let ls: { [key: string]: any } = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-7") || "{}");
    } catch (e) {
      // Ignore errors
    }
  }
  return ls[key];
}

function saveToLS(key: string, value: any): void {
  if (global.localStorage) {
    const existingData = JSON.parse(global.localStorage.getItem("rgl-7") || "{}");
    existingData[key] = value;
    global.localStorage.setItem("rgl-7", JSON.stringify(existingData));
  }
}

export default DropDrag;
