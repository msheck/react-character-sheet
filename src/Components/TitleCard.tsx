import { LayoutItem } from "../Types";
import { defaultFontSize, getItemTitle, itemSumSize } from "../Utils";

export function getTitleCard(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  const fontSize = (): number => {
    return defaultFontSize();
    //return Math.min((defaultFontSize() * itemSumSize(layoutItem, 0.6, 0.5, -0.5)), 22);
  }

  return (
    <>
      <div className="item-content" id="title-card-content">
        {getItemTitle(layoutItem, updateItem, fontSize)}
      </div>
    </>
  );
}