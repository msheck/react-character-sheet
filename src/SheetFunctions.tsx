import { LayoutItem, Layouts } from "./Types";
import { getFromLS } from "./Utils";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import LayoutTemplate from "./Data/LayoutTemplate.json";
import ToolboxTemplates from "./Data/ToolboxTemplates.json";

export const useSheetFunctions = () => {
  const [layouts, setLayouts] = useState<Layouts>({
    lg: (getFromLS("layout").length === 0
      ? LayoutTemplate
      : getFromLS("layout") || []
    ).map((item: LayoutItem) => ({
      ...item,
      colSizes: item.colSizes?.map((size) => size ?? 0) || [], // Ensure colSizes is a number[]
    })),
  });

  const [toolbox, setToolbox] = useState<Layouts>({
    lg: (getFromLS("toolbox").length === 0
      ? ToolboxTemplates
      : getFromLS("toolbox")
    ).map((item: LayoutItem) => ({
      ...item,
      colSizes: item.colSizes?.map((size) => size ?? 0) || [], // Ensure colSizes is a number[]
    })),
  });

  const [editMode, setEditMode] = useState(false);

  // Function to add a new element with a unique ID
  const addGridItem = (item: LayoutItem) => {
    const newItem: LayoutItem = {
      x: 0,
      y: 0,
      w: item.w,
      h: item.h,
      minW: item.minW,
      maxW: item.maxW,
      minH: item.minH,
      maxH: item.maxH,
      i: uuidv4(),
      type: item.type,
      isLocked: item.isLocked,
      static: !editMode,
      isDraggable: editMode,
      label: item.label,
      data: item.data,
      colSizes: item.colSizes || [],
    };
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: [...prevLayouts.lg, newItem],
    }));
  };

  // Function to move an item from the toolbox to the grid
  const onTakeItem = (item: LayoutItem) => {
    if (item.template) {
      addGridItem(item);
    }
    else {
      setToolbox((prevToolbox) => ({
        ...prevToolbox,
        lg: prevToolbox.lg.filter(({ i }) => i !== item.i),
      }));
      setLayouts((prevLayouts) => ({
        ...prevLayouts,
        lg: [...prevLayouts.lg, { ...item, static: item.static, isDraggable: item.isDraggable }],
      }));
    }
  };

  // Function to move an item from the grid back to the toolbox
  const onPutItem = (item: LayoutItem) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.filter(({ i }) => i !== item.i),
    }));
    if (!((item.title == null || item.title == "") && item.data?.every(r => r.every(c => c == null || c == "")))) {
      setToolbox((prevToolbox) => ({
        ...prevToolbox,
        lg: [...prevToolbox.lg, item],
      }));
    }
  };

  // Function to remove an item from the toolbox
  const onRemoveToolboxItem = (item: LayoutItem) => {
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      lg: prevToolbox.lg.filter(({ i }) => i !== item.i),
    }));
  };

  // Function to update the title or data array of a grid item
  const updateItem = (id: string, field: string, value: string) => {
    if (field.startsWith("data")) {
      let [rowIndex, colIndex] = field.split("-").slice(1).map(Number);
      if (colIndex === undefined) { // If colIndex is undefined, it's a unidimensional array
        colIndex = rowIndex;
        rowIndex = 0;
      }
      setLayouts((prevLayouts) => ({
        ...prevLayouts,
        lg: prevLayouts.lg.map((item) => {
          if (item.i === id) {
            const newData = item.data ? [...item.data] : [];
            // Ensure the array has the required length
            while (newData.length < rowIndex) {
              newData.push([]);
            }
            while (newData[rowIndex].length < colIndex) {
              newData[rowIndex].push("");
            }
            // Update the specific index
            newData[rowIndex][colIndex] = value;
            return { ...item, data: newData };
          }
          return item;
        }),
      }));
    }
    else {
      setLayouts((prevLayouts) => ({
        ...prevLayouts,
        lg: prevLayouts.lg.map((item) =>
          item.i === id ? { ...item, [field]: value } : item
        ),
      }));
    }
  };

  // Function to remove an item in data array property of a grid item
  const removeItem = (id: string, rowIndex: number, colIndex: number) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.map((item) => {
        if (item.i === id) {
          // Remove the specific index or entire row
          const newData = item.data ? [...item.data] : [];
          if (newData[rowIndex]) {
            if (colIndex === -1) {
              newData.splice(rowIndex, 1);
            } else {
              newData[rowIndex] = newData[rowIndex].filter((_, index) => index !== colIndex);
            }
          }
          return { ...item, data: newData };
        }
        return item;
      }),
    }));
  };

  // Function to add an item to the data array property of a grid item
  const addItem = (id: string, rowIndex: number, value: string) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.map((item) => {
        if (item.i === id) {
          // Add the new value to the end of the array
          const newData = item.data ? [...item.data] : [];
          while (newData.length <= rowIndex) {
            newData.push([]);
          }
          newData[rowIndex] = [...newData[rowIndex], value];
          return { ...item, data: newData };
        }
        return item;
      }),
    }));
  };

  // Function to update the column size of a grid item
  const updateColSize = (id: string, colIndex: number, size: number) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.map((item) => {
        if (item.i === id) {
          const newColSizes = item.colSizes ? [...item.colSizes] : [];
          newColSizes[colIndex] = size;
          return { ...item, colSizes: newColSizes };
        }
        return item;
      }),
    }));
  };

  // Function to allow/lock editing of a grid item while in edit mode
  const lockItem = (id: string) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.map((item) =>
        item.i === id ? { ...item, isLocked: !item.isLocked, static: (!editMode || !item.isLocked), isDraggable: (editMode && item.isLocked) } : item
      ),
    }));
  };

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  return {
    layouts,
    toolbox,
    editMode,
    addGridItem,
    onTakeItem,
    onPutItem,
    onRemoveToolboxItem,
    updateItem,
    removeItem,
    addItem,
    updateColSize,
    lockItem,
    toggleEditMode,
    setLayouts,
  };
};