import { LayoutItem } from "../Types";
import { hasTitle, itemSumSize, getPaddingValue, getDefaultFontSize, getItemTitle } from "../Utils";

export function getStatPool(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  const fontSize = (): number => {
    return Math.min((getDefaultFontSize() * itemSumSize(layoutItem, 0.1, 0.4, 0.7)), getDefaultFontSize() + 4);
  }

  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "stat-pool-content" : "stat-pool-content-notitle"}>
        {getItemTitle(layoutItem, updateItem, fontSize(), "stat-pool-title")}
        <div className="item-content" id="stat-pool-comparer">
          <input
            id="stat-pool-count"
            style={{ fontSize: fontSize(), paddingLeft: getPaddingValue(layoutItem, 2, 0.25, 15) }}
            type="number"
            value={layoutItem.data?.at(0)?.at(0)}
            onChange={(e) => updateItem(layoutItem.i, "data-0", e.target.value)}
          />
          <hr />
          <input
            id="stat-pool-count"
            style={{ fontSize: fontSize(), paddingLeft: getPaddingValue(layoutItem, 2, 0.25, 15) }}
            type="number"
            value={layoutItem.data?.at(0)?.at(1)}
            onChange={(e) => updateItem(layoutItem.i, "data-1", e.target.value)}
            disabled={layoutItem.static}
          />
        </div>
      </div>
    </>
  );
}