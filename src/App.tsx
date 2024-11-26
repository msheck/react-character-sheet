import { FunctionComponent, useState, useEffect } from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./styles.css";

interface Props {
  domElements: any[];
  className?: string;
  rowHeight?: number;
  onLayoutChange?: (layout: any, layouts: any) => void;
  cols?: { [key: string]: number };
  breakpoints?: { [key: string]: number };
  containerPadding?: [number, number] | { [key: string]: [number, number] };
}

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const DropDrag: FunctionComponent<Props> = ({
  domElements,
  className = "layout",
  rowHeight = 30,
  onLayoutChange = () => {},
  cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  containerPadding = [0, 0],
}) => {
  const [layouts, setLayouts] = useState<{ [key: string]: any[] }>({
    lg: _.range(25).map((i) => ({
      x: (_.random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * (Math.ceil(Math.random() * 4) + 1),
      w: 2,
      h: Math.ceil(Math.random() * 4) + 1,
      i: i.toString(),
      static: Math.random() < 0.05,
    })),
  });

  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("lg");
  const [compactType, setCompactType] = useState<"vertical" | "horizontal" | null>("vertical");
  const [mounted, setMounted] = useState(false);
  const [toolbox, setToolbox] = useState<{ [key: string]: any[] }>({ lg: [] });

  useEffect(() => setMounted(true), []);

  const handleBreakpointChange = (breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      [breakpoint]: prevToolbox[breakpoint] || prevToolbox[currentBreakpoint] || [],
    }));
  };

  const handleLayoutChange = (_layout: any, updatedLayouts: any) => {
    setLayouts({ ...updatedLayouts });
    onLayoutChange(_layout, updatedLayouts);
  };

  const handleDrop = (_layout: any, layoutItem: any) => {
    alert(`Element parameters:\n${JSON.stringify(layoutItem, ["x", "y", "w", "h"], 2)}`);
  };

  return (
    <div className="mb-4">
      <ResponsiveReactGridLayout
        className={className}
        rowHeight={rowHeight}
        cols={cols}
        breakpoints={breakpoints}
        containerPadding={containerPadding}
        layouts={layouts}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        compactType={compactType}
        preventCollision={!compactType}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
        onDrop={handleDrop}
        isDroppable
      >
        {layouts.lg.map((layoutItem) => (
          <div
            key={layoutItem.i}
            style={{ background: "#ccc" }}
            className={layoutItem.static ? "static" : ""}
          >
            <span className="text">
              {layoutItem.static ? `Static - ${layoutItem.i}` : layoutItem.i}
            </span>
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default DropDrag;