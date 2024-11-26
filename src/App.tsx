import { FunctionComponent, useState, useEffect } from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
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
    lg: [],
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLayoutChange = (_layout: any, updatedLayouts: any) => {
    setLayouts({ ...updatedLayouts });
    onLayoutChange(_layout, updatedLayouts);
  };

  // Function to add a new element
  const addItem = () => {
    const newItem = {
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      i: `${layouts.lg.length}`, // unique ID based on current length
    };
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: [...prevLayouts.lg, newItem],
    }));
  };

  // Function to remove an element
  const removeItem = (id: string) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.filter((item) => item.i !== id),
    }));
  };

  return (
    <div className="mb-4">
      <button onClick={addItem}>Add Element</button>
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
            <span className="remove-button" onClick={() => removeItem(layoutItem.i)}>x</span>
            <span className="item-content">{layoutItem.i}</span>
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default DropDrag;
