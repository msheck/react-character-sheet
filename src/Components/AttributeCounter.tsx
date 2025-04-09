import { LayoutItem } from "../Types";
import { hasTitle, itemSumSize } from "../Utils";

export function getAttributeCounter(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "attribute-counter-content" : "attribute-counter-content-notitle"}>
        {
          layoutItem.static ?
            (hasTitle(layoutItem) &&
              <h4 id="attribute-counter-title">{layoutItem.title}</h4>
            ) : (
              <input
                id="attribute-counter-title"
                type="text"
                value={layoutItem.title}
                onChange={(e) => updateItem(layoutItem.i, "title", e.target.value)}
                placeholder="Title"
              />
            )
        }
        <input
          id="attribute-counter-count"
          style={{ fontSize: 12 * itemSumSize(layoutItem, 0.5, 1, -0.5) }}
          type="number"
          value={layoutItem.data?.at(0)?.at(0)}
          onChange={(e) => updateItem(layoutItem.i, "data-0", e.target.value)}
        />
      </div>
    </>
  );
}