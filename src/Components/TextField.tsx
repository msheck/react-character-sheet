import { LayoutItem } from "../Types";
import { getDefaultFontSize, getItemTitle, hasTitle, itemSumSize } from "../Utils";

export function getTextField(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  const fontSize = (): number => {
    return Math.min((getDefaultFontSize() * itemSumSize(layoutItem, 0, 1, 0.8)), getDefaultFontSize() + 6);
  }

  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "text-field-content" : "text-field-content-notitle"}>
        {getItemTitle(layoutItem, updateItem, fontSize(), "text-field-title")}
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