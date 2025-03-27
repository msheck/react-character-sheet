import { FunctionComponent } from "react";
import { ToolBoxItemProps } from "./Types";

// ToolBoxItem Component
const ToolBoxItem: FunctionComponent<ToolBoxItemProps> = ({
  item,
  onTakeItem,
  onRemoveItem,
}) => {
  return (
    <div className="toolbox-item">
      <div
        className="toolbox-label"
        onClick={() => onTakeItem(item)}
      >
        <span>{item.label ?? item.title}</span>
      </div>
      <div
        className="toolbox-remove"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the onTakeItem event
          onRemoveItem(item);
        }}
      >
        <span>&times;</span>
      </div>
    </div>
  );
};

export default ToolBoxItem;