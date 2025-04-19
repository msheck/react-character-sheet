import { LayoutItem } from "../Types";
import { defaultFontSize, getItemTitle, hasTitle, itemSumSize } from "../Utils";

export function getAttributeCounter(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  const fontSize = (): number => {
    return defaultFontSize();
    //return fontSize: 12 * itemSumSize(layoutItem, 0.5, 1, -0.5;
  }

  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "attribute-counter-content" : "attribute-counter-content-notitle"}>
        {getItemTitle(layoutItem, updateItem, fontSize, "attribute-counter-title")}
        <input
          id="attribute-counter-count"
          style={{ fontSize: fontSize() }}
          type="number"
          value={layoutItem.data?.at(0)?.at(0)}
          onChange={(e) => updateItem(layoutItem.i, "data-0", e.target.value)}
        />
      </div>
    </>
  );
}