import React from "react";
import { ComponentProps } from "../Types";
import { hasTitle, itemSumSize, getDefaultFontSize, getItemTitle, useNumberInput } from "../Utils";

const StatPool: React.FC<ComponentProps> = ({ layoutItem, updateItem }) => {
  const fontSize = (): number => {
    return Math.min((getDefaultFontSize() * itemSumSize(layoutItem, 0.1, 0.4, 0.7)), getDefaultFontSize() + 4);
  };

  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "stat-pool-content" : "stat-pool-content-notitle"}>
        {getItemTitle(layoutItem, updateItem, fontSize(), "stat-pool-title")}
        <div className="item-content" id="stat-pool-comparer">
          {useNumberInput(layoutItem, layoutItem.data?.at(0)?.at(0), 0, undefined, updateItem, fontSize(), layoutItem.isLocked, "stat-pool-count")}
          <hr />
          {useNumberInput(layoutItem, layoutItem.data?.at(0)?.at(1), 1, undefined, updateItem, fontSize(), layoutItem.static, "stat-pool-count")}
        </div>
      </div>
    </>
  );
};

export default StatPool;