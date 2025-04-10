import { JSX } from "react";
import { LayoutItem } from "./Types";

// Utility functions for localStorage
export function getFromLS(key: string): LayoutItem[] {
  let ls: { [key: string]: LayoutItem[] } = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("appData") || "{}");
    } catch (e) {
      console.error("Failed to parse localStorage data:", e);
    }
  }
  return ls[key] || [];
}

export function saveToLS(key: string, value: LayoutItem[]): void {
  if (global.localStorage) {
    try {
      const existingData = JSON.parse(global.localStorage.getItem("appData") || "{}");
      existingData[key] = value;
      global.localStorage.setItem("appData", JSON.stringify(existingData));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }
}

export function hasTitle(layoutItem: LayoutItem): boolean {
  return layoutItem.title != "" && layoutItem.title != null
}

export function itemSumSize(layoutItem: LayoutItem, widthMod: number = 1, heightMod: number = 1, offset: number = 0): number {
  return (widthMod * layoutItem.w) + (heightMod * layoutItem.h) + offset;
}

export function getPaddingValue(layoutItem: LayoutItem, mod: number = 1, offset: number = 1, maxValue: number = Number.MAX_VALUE) {
  let padding = (mod * itemSumSize(layoutItem)) + offset;
  return padding > maxValue ? maxValue : padding;
}

export function useCheckbox(
  layoutItem: LayoutItem,
  data: string,
  rowIndex: number,
  colIndex: number | undefined,
  updateItem: (id: string, field: string, value: string) => void,
  idHtml: string | "" = "",
  classHtlm: string | "" = "",
  customElement: JSX.Element | null = null
) {
  return data.startsWith("/checkbox") && layoutItem.static ?
    (
      <input
        id={idHtml + "-checkbox"}
        className={classHtlm + "-checkbox"}
        type="checkbox"
        checked={data === "/checkbox-checked"}
        onChange={(e) => updateItem(layoutItem.i, "data-" + rowIndex + (colIndex != undefined ? "-" + colIndex : ""), e.target.checked ? "/checkbox-checked" : "/checkbox")}
      />
    ) : (
      customElement ?
        customElement :
        <textarea
          id={idHtml}
          className={classHtlm}
          value={data}
          onChange={(e) => updateItem(layoutItem.i, "data-" + rowIndex + (colIndex != undefined ? "-" + colIndex : ""), e.target.value)}
        />
    )
}