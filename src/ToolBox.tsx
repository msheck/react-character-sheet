import { FunctionComponent } from "react";
import { LayoutItem, Layouts, ToolBoxItemProps, ToolBoxProps, Props } from "./Types";
import ToolBoxItem from "./ToolBoxItem";

// ToolBox Component
const ToolBox: FunctionComponent<ToolBoxProps> = ({
  items,
  onTakeItem,
  onRemoveItem,
}) => {
  return (
    <div className="toolbox">
      <h4 className="toolbox-title">Toolbox</h4>
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
    </div>
  );
};

export default ToolBox;