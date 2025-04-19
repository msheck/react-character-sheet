import { LayoutItem } from "../Types";
import { defaultFontSize, getItemTitle, hasTitle, useCheckbox } from "../Utils";

export function getTextBox(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  const fontSize = (): number => {
    return defaultFontSize();
    //return Math.min((12 * itemSumSize(layoutItem, 0.4, 0.9, -0.5)), 24 * layoutItem.h);
  }

  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "text-box-content" : "text-box-content-notitle"}>
        {getItemTitle(layoutItem, updateItem, fontSize)}
        {
          useCheckbox(layoutItem, layoutItem.data?.at(0)?.at(0) ?? "", 0, undefined, updateItem, fontSize, "text-box-data", "",
            <textarea
              id="text-box-data"
              disabled={layoutItem.static}
              value={layoutItem.data?.at(0)?.at(0)}
              onChange={(e) => updateItem(layoutItem.i, "data-0", e.target.value)}
              placeholder={layoutItem.static ? "" : "Description"}
              style={{ fontSize: fontSize() }}
            />)
        }
      </div>
    </>
  );
}