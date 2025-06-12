import { JSX } from "react";
import { ColorItems, LayoutItem, Tab } from "./Types";

let defaultFontSizeValue = 10;

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

export function getColorsFromLS(): ColorItems {
  let ls: { [key: string]: ColorItems } = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("appData") || "{}");
    } catch (e) {
      console.error("Failed to parse localStorage data:", e);
    }
  }
  return ls["defaultColors"];
}

export function getTabsFromLS(): Tab[] {
  let ls: { [key: string]: any } = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("appData") || "{}");
    } catch (e) {
      console.error("Failed to parse localStorage data:", e);
    }
  }
  return ls["tabs"] || [];
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

export function saveColorsToLS(colors: ColorItems): void {
  if (global.localStorage) {
    try {
      const existingData = JSON.parse(global.localStorage.getItem("appData") || "{}");
      existingData["defaultColors"] = colors;
      global.localStorage.setItem("appData", JSON.stringify(existingData));
    } catch (e) {
      console.error("Failed to save colors to localStorage:", e);
    }
  }
}

export function saveTabsToLS(tabs: Tab[]): void {
  if (global.localStorage) {
    try {
      const existingData = JSON.parse(global.localStorage.getItem("appData") || "{}");
      existingData["tabs"] = tabs;
      global.localStorage.setItem("appData", JSON.stringify(existingData));
    } catch (e) {
      console.error("Failed to save tabs to localStorage:", e);
    }
  }
}

export function deleteLayoutFromLS(key: string): void {
  if (global.localStorage) {
    try {
      const existingData = JSON.parse(global.localStorage.getItem("appData") || "{}");
      if (existingData[key]) {
        delete existingData[key];
        global.localStorage.setItem("appData", JSON.stringify(existingData));
      }
    } catch (e) {
      console.error("Failed to delete layout from localStorage:", e);
    }
  }
}

export function setDefaultFontSize(size: number): void {
  defaultFontSizeValue = size;
}

export function getDefaultFontSize(): number {
  return defaultFontSizeValue;
}

export function hasTitle(layoutItem: LayoutItem): boolean {
  return layoutItem.title != "" && layoutItem.title != null
}

export function itemSumSize(layoutItem: LayoutItem, widthMod: number = 1, heightMod: number = 1, offset: number = 0): number {
  return (widthMod * layoutItem.w / 10) + (heightMod * layoutItem.h / 10) + offset;
}

export function getPaddingValue(layoutItem: LayoutItem, mod: number = 1, offset: number = 1, maxValue: number = Number.MAX_VALUE) {
  let padding = (mod * itemSumSize(layoutItem)) + offset;
  return padding > maxValue ? maxValue : padding;
}

export function getItemTitle(
  layoutItem: LayoutItem,
  updateItem: (id: string, field: string, value: string) => void,
  fontSize: number = defaultFontSizeValue,
  idHtml: string | "" = "",
  classHtlm: string | "" = ""
) {
  return (layoutItem.static ?
    (
      hasTitle(layoutItem) &&
      (
        <h4
          id={idHtml}
          className={classHtlm}
          style={{ fontSize: fontSize }}
        >
          {layoutItem.title}
        </h4>
      )
    ) : (
      <input
        id={idHtml}
        className={classHtlm}
        type="text"
        style={{ fontSize: fontSize }}
        value={layoutItem.title}
        onChange={(e) => updateItem(layoutItem.i, "title", e.target.value)}
        placeholder="Title"
      />
    )
  )
}

export function useCommandCall(
  layoutItem: LayoutItem,
  data: string,
  rowIndex: number,
  colIndex: number | undefined,
  updateItem: (id: string, field: string, value: string) => void,
  fontSize: number = defaultFontSizeValue,
  readonly: boolean = false,
  idHtml: string | "" = "",
  classHtlm: string | "" = "",
  customElement: JSX.Element | null = null
) {
  const element = () => {
    return (customElement ?
      customElement :
      <textarea
        id={idHtml}
        className={classHtlm}
        readOnly={readonly}
        value={data}
        onChange={(e) => updateItem(layoutItem.i, "data-" + rowIndex + (colIndex != undefined ? "-" + colIndex : ""), e.target.value)}
        style={{ fontSize: fontSize }}
      />)
  }

  if (layoutItem.static) {
    if (data.startsWith("/checkbox"))
      return useCheckbox(layoutItem, data, rowIndex, colIndex, updateItem, fontSize, idHtml, classHtlm);
    else if (data.startsWith("/number"))
      return useNumberInput(layoutItem, data, rowIndex, colIndex, updateItem, fontSize - 2, data.includes(":lock"), idHtml, classHtlm, true);
    else
      return element();
  }
  else {
    return element();
  }
}

export function useCheckbox(
  layoutItem: LayoutItem,
  data: string,
  rowIndex: number,
  colIndex: number | undefined,
  updateItem: (id: string, field: string, value: string) => void,
  fontSize: number = defaultFontSizeValue,
  idHtml: string | "" = "",
  classHtlm: string | "" = ""
) {
  return (
    <label
      className="checkbox-label"
    >
      <input
        id={idHtml + "-checkbox"}
        className={classHtlm + "-checkbox"}
        type="checkbox"
        checked={data === "/checkbox-checked"}
        onChange={(e) => updateItem(layoutItem.i, "data-" + rowIndex + (colIndex != undefined ? "-" + colIndex : ""), e.target.checked ? "/checkbox-checked" : "/checkbox")}
      />
      <span
        className="checkbox-custom"
        style={{ fontSize: fontSize * 2.5 }}
      />
    </label>
  )
}

export function useNumberInput(
  layoutItem: LayoutItem,
  data: string | undefined,
  rowIndex: number,
  colIndex: number | undefined,
  updateItem: (id: string, field: string, value: string) => void,
  fontSize: number = defaultFontSizeValue,
  readonly: boolean = false,
  idHtml: string | "" = "",
  classHtlm: string | "" = "",
  commandCall: boolean = false
) {
  const handleStep = (step: number) => {
    const currentValue = parseInt((commandCall ? data?.split('#')[1] : data) || "0", 10);
    const newValue = currentValue + step;
    updateItem(layoutItem.i, "data-" + rowIndex + (colIndex != undefined ? "-" + colIndex : ""), commandCall ? (data?.split('#')[0] + '#' + newValue.toString()) : newValue.toString());
  };
  return (
    <div className="custom-number-input">
      {readonly ? null :
        <span
          className="value-control value-control-up"
          onMouseDown={(e) => handleStep(e.shiftKey ? 10 : e.ctrlKey ? 5 : 1)}
          style={{ fontSize: fontSize * 0.75 }}
        >
          &#10148;
        </span>
      }
      <input
        id={idHtml}
        className={classHtlm}
        style={{ fontSize: fontSize * 2 }}
        type="number"
        value={commandCall ? data?.split('#')[1] : data}
        readOnly={readonly}
        onChange={(e) => updateItem(layoutItem.i, "data-" + rowIndex + (colIndex != undefined ? "-" + colIndex : ""), commandCall ? (data?.split('#')[0] + '#' + e.target.value) : e.target.value)}
      />
      {readonly ? null :
        <span
          className="value-control value-control-down"
          onMouseDown={(e) => handleStep(e.shiftKey ? -10 : e.ctrlKey ? -5 : -1)}
          style={{ fontSize: fontSize * 0.75 }}
        >
          &#10148;
        </span>
      }
    </div>
  )
}