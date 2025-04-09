import { FunctionComponent, useState } from "react";
import { ToolBoxProps } from "./Types";
import ToolBoxItem from "./ToolBoxItem";

// ToolBox Component
const ToolBox: FunctionComponent<ToolBoxProps> = ({
  items,
  onTakeItem,
  onRemoveItem,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  return (
    <div className={`toolbox ${isCollapsed ? "collapsedToolbox" : ""}`} onClick={handleToggleCollapse}>
      <h4 className="toolbox-title">Toolbox</h4>
      {!isCollapsed && (
        <div className="toolbox-grid">
          {items.map((item) => (
            <ToolBoxItem
              key={item.i}
              item={item}
              onTakeItem={onTakeItem}
              onRemoveItem={onRemoveItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolBox;