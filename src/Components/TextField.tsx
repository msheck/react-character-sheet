import { LayoutItem } from "../Types";
import { hasTitle, itemSumSize } from "../Utils";

function fontSize(layoutItem: LayoutItem) {
  return Math.min((15 * itemSumSize(layoutItem, 0, 1, 0)), 20);
}

function staticTextField(layoutItem: LayoutItem) {
  return (
    <>
      {(hasTitle(layoutItem)) &&
        <h4 id="text-field-title" style={{ fontSize: fontSize(layoutItem) }}>{layoutItem.title}</h4>
      }
    </>
  );
}

function editableTextField(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  return (
    <>
      <input id="text-field-title"
        type="text"
        style={{ fontSize: fontSize(layoutItem) }}
        value={layoutItem.title}
        onChange={(e) => updateItem(layoutItem.i, "title", e.target.value)}
        placeholder="Title" />
    </>
  );
}

export function getTextField(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "text-field-content" : "text-field-content-notitle"}>
        {
          layoutItem.static
            ? staticTextField(layoutItem)
            : editableTextField(layoutItem, updateItem)
        }
        <input id="text-field-input"
          type="text"
          value={layoutItem.data?.at(0)?.at(0)}
          onChange={(e) => updateItem(layoutItem.i, "data-0", e.target.value)}
          placeholder="" />
      </div>
    </>
  );
}