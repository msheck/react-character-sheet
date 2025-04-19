import { LayoutItem } from "../Types";
import { defaultFontSize, getItemTitle, hasTitle, itemSumSize } from "../Utils";

export function getTextField(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  const fontSize = (): number => {
    return defaultFontSize();
    //return Math.min((12 * itemSumSize(layoutItem, 0, 0.75, 0.25)), 20);
  }

  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "text-field-content" : "text-field-content-notitle"}>
        {getItemTitle(layoutItem, updateItem, fontSize, "text-field-title")}
        <input
          id="text-field-input"
          type="text"
          value={layoutItem.data?.at(0)?.at(0)}
          onChange={(e) => updateItem(layoutItem.i, "data-0", e.target.value)}
          placeholder=""
        />
      </div>
    </>
  );
}