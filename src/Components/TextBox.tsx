import React from "react";
import { ComponentProps } from "../Types";
import { getDefaultFontSize, getItemTitle, hasTitle, itemSumSize, useCommandCall } from "../Utils";

const TextBox: React.FC<ComponentProps> = ({ layoutItem, updateItem }) => {
  const fontSize = (): number => {
    return Math.min((getDefaultFontSize() * itemSumSize(layoutItem, 0.1, 0.4, 0.8)), getDefaultFontSize() + 4);
  };

  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "text-box-content" : "text-box-content-notitle"}>
        {getItemTitle(layoutItem, updateItem, fontSize())}
        {
          useCommandCall(layoutItem, layoutItem.data?.at(0)?.at(0) ?? "", 0, undefined, updateItem, fontSize(), false, "text-box-data", "",
            <textarea
              id="text-box-data"
              className={layoutItem.isLocked ? "text-box-locked" : "text-box-unlocked"}
              disabled={layoutItem.isLocked}
              value={layoutItem.data?.at(0)?.at(0)}
              onChange={(e) => updateItem(layoutItem.i, "data-0", e.target.value)}
              placeholder={layoutItem.static ? "" : "Description"}
              style={{ fontSize: fontSize() - 2 }}
            />)
        }
      </div>
    </>
  );
};

export default TextBox;