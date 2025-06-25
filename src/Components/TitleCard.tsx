import React from "react";
import { ComponentProps } from "../Types";
import { getDefaultFontSize, getItemTitle, itemSumSize } from "../Utils";

const TitleCard: React.FC<ComponentProps> = ({ layoutItem, updateItem }) => {
  const fontSize = (): number => {
    return Math.min((getDefaultFontSize() * itemSumSize(layoutItem, 0, 1.5, 1)), getDefaultFontSize() + 12);
  };

  return (
    <>
      <div className="item-content" id="title-card-content">
        {getItemTitle(layoutItem, updateItem, fontSize())}
      </div>
    </>
  );
};

export default TitleCard;