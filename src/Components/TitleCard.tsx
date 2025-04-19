import { LayoutItem } from "../Types";
import { getDefaultFontSize, getItemTitle, itemSumSize } from "../Utils";

export function getTitleCard(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  const fontSize = (): number => {
    return Math.min((getDefaultFontSize() * itemSumSize(layoutItem, 0, 1.5, 1)), getDefaultFontSize() + 12);
  }

  return (
    <>
      <div className="item-content" id="title-card-content">
        {getItemTitle(layoutItem, updateItem, fontSize())}
      </div>
    </>
  );
}