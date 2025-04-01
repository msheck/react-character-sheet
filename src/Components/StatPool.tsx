import { LayoutItem } from "../Types";
import { hasTitle, itemSumSize } from "../Utils";

function staticStatPool(layoutItem: LayoutItem) {
  return (
    (hasTitle(layoutItem)) &&
    <>
      <h4 id="stat-pool-title">{layoutItem.title}</h4>
    </>
  );
}

function editableStatPool(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  return (
    <>
      <input id="stat-pool-title"
        type="text"
        value={layoutItem.title}
        onChange={(e) => updateItem(layoutItem.i, "title", e.target.value)}
        placeholder="Title" />
    </>
  );
}

export function getStatPool(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "stat-pool-content" : "stat-pool-content-notitle"}>
        {
          layoutItem.static
            ? staticStatPool(layoutItem)
            : editableStatPool(layoutItem, updateItem)
        }
        <div className="item-content" id="stat-pool-comparer">
          <input id="stat-pool-count"
            style={{ fontSize: 12 * itemSumSize(layoutItem, 0.5, 1) }}
            type="number"
            value={layoutItem.data?.at(0)}
            onChange={(e) => updateItem(layoutItem.i, "data-0", e.target.value)} />
          <hr />
          <input id="stat-pool-count"
            style={{ fontSize: 12 * itemSumSize(layoutItem, 0.5, 1) }}
            type="number"
            value={layoutItem.data?.at(1)}
            onChange={(e) => updateItem(layoutItem.i, "data-1", e.target.value)}
            disabled={layoutItem.static} />
        </div>
      </div>
    </>
  );
}