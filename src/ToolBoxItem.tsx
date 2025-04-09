import { FunctionComponent } from "react";
import { ToolBoxItemProps } from "./Types";

// ToolBoxItem Component
const ToolBoxItem: FunctionComponent<ToolBoxItemProps> = ({
  item,
  onTakeItem,
  onRemoveItem,
}) => {
  return (
    <div id={item.template ? "toolbox-item-template" : "toolbox-item-custom" } className="toolbox-item" onClick={() => onTakeItem(item)}>
      <div className="toolbox-label">
        <span>{item.title ?? item.label}</span>
      </div>
      {!item.template &&
        <>
          <div
            className="toolbox-remove"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the onTakeItem event
              onRemoveItem(item);
            }}
          >
            <span>&times;</span>
          </div>
        </>
      }
    </div>
  );
};

export default ToolBoxItem;