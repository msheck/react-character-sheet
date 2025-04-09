import { LayoutItem } from "../Types";
import { hasTitle, useCheckbox } from "../Utils";

export function getTextBox(layoutItem: LayoutItem, updateItem: (id: string, field: string, value: string) => void) {
  return (
    <>
      <div className="item-content" id={(hasTitle(layoutItem) || !layoutItem.static) ? "text-box-content" : "text-box-content-notitle"}>
        {
          layoutItem.static ?
            (
              (hasTitle(layoutItem)) && <h4>{layoutItem.title}</h4>
            ) : (
              <input
                type="text"
                value={layoutItem.title}
                onChange={(e) => updateItem(layoutItem.i, "title", e.target.value)}
                placeholder="Title"
              />
            )
        }
        {
          useCheckbox(layoutItem, layoutItem.data?.at(0)?.at(0) ?? "", 0, 0, updateItem, "text-box-data", "",
            <textarea
              id="text-box-data"
              disabled={layoutItem.static}
              value={layoutItem.data?.at(0)?.at(0)}
              onChange={(e) => updateItem(layoutItem.i, "data-0", e.target.value)}
              placeholder={layoutItem.static ? "" : "Description"}
            />)
        }
      </div>
    </>
  );
}