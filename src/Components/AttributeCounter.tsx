import { LayoutItem } from "../Types";
import { getDefaultFontSize, getItemTitle, hasTitle, itemSumSize, useNumberInput } from "../Utils";

export function getAttributeCounter(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  const fontSize = (): number => {
    return Math.min((getDefaultFontSize() * itemSumSize(layoutItem, 0.1, 0.4, 0.7)), getDefaultFontSize() + 4);
  }

  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "attribute-counter-content" : "attribute-counter-content-notitle"}>
        {getItemTitle(layoutItem, updateItem, fontSize(), "attribute-counter-title")}
        {useNumberInput(layoutItem, layoutItem.data?.at(0)?.at(0), 0, undefined, updateItem, fontSize(), layoutItem.isLocked, "attribute-counter-count")}
      </div>
    </>
  );
}