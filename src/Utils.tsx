import { LayoutItem } from "./Types";

// Utility functions for localStorage
export function getFromLS(key: string): LayoutItem[] {
  let ls: { [key: string]: LayoutItem[] } = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-7") || "{}");
    } catch (e) {
      console.error("Failed to parse localStorage data:", e);
    }
  }
  return ls[key] || [];
}

export function saveToLS(key: string, value: LayoutItem[]): void {
  if (global.localStorage) {
    try {
      const existingData = JSON.parse(global.localStorage.getItem("rgl-7") || "{}");
      existingData[key] = value;
      global.localStorage.setItem("rgl-7", JSON.stringify(existingData));
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

export function getPaddingValue(layoutItem: LayoutItem, mod:number = 1, offset: number = 1, maxValue: number = Number.MAX_VALUE) {
  let padding = (mod * itemSumSize(layoutItem)) + offset;
  return padding > maxValue ? maxValue : padding;
}