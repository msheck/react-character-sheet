import { LayoutItem } from "../Types";
import { getDefaultFontSize, getItemTitle, hasTitle, itemSumSize } from "../Utils";

export function getAttributeCounter(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  const fontSize = (): number => {
    return Math.min((getDefaultFontSize() * itemSumSize(layoutItem, 0.1, 0.4, 0.7)), getDefaultFontSize() + 4);
  }

  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "attribute-counter-content" : "attribute-counter-content-notitle"}>
        {getItemTitle(layoutItem, updateItem, fontSize(), "attribute-counter-title")}
        <input
          id="attribute-counter-count"
          style={{ fontSize: fontSize() * 2 }}
          type="number"
          value={layoutItem.data?.at(0)?.at(0)}
          onChange={(e) => updateItem(layoutItem.i, "data-0", e.target.value)}
        />
      </div>
    </>
  );
}