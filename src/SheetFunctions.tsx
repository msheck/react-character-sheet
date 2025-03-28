import { LayoutItem, Layouts } from "./Types";
import { getFromLS } from "./Utils";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import ToolboxTemplates from "./Data/ToolboxTemplates.json";

export const useSheetFunctions = () => {
  const [layouts, setLayouts] = useState<Layouts>({
    lg: getFromLS("layout") || [],
  });

  const [toolbox, setToolbox] = useState<Layouts>({
    lg: getFromLS("toolbox").length === 0
      ? ToolboxTemplates : getFromLS("toolbox"),
  });

  const [editMode, setEditMode] = useState(false);

  // Function to add a new element with a unique ID
  const addItem = (item: LayoutItem) => {
    const newItem: LayoutItem = {
      x: 0,
      y: 0,
      w: item.w,
      h: item.h,
      minW: item.minW,
      maxW: item.maxW,
      minH: item.minH,
      maxH: item.maxH,
      i: item.i + '#' + uuidv4(),
      static: !editMode,
      isDraggable: editMode,
    };
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: [...prevLayouts.lg, newItem],
    }));
  };

  // Function to move an item from the toolbox to the grid
  const onTakeItem = (item: LayoutItem) => {
    if (item.template) {
      addItem(item);
    }
    else {
      setToolbox((prevToolbox) => ({
        ...prevToolbox,
        lg: prevToolbox.lg.filter(({ i }) => i !== item.i),
      }));
      setLayouts((prevLayouts) => ({
        ...prevLayouts,
        lg: [...prevLayouts.lg, { ...item, static: !editMode, isDraggable: editMode }], // Set static and isDraggable based on editMode
      }));
    }
  };

  // Function to move an item from the grid back to the toolbox
  const onPutItem = (item: LayoutItem) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.filter(({ i }) => i !== item.i),
    }));
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      lg: [...prevToolbox.lg, item],
    }));
  };

  // Function to remove an item from the toolbox
  const onRemoveToolboxItem = (item: LayoutItem) => {
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      lg: prevToolbox.lg.filter(({ i }) => i !== item.i),
    }));
  };

  // Function to update the title or description of a grid item
  const updateItem = (id: string, field: string, value: string) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.map((item) =>
        item.i === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Function to allow/lock editing of a grid item while in edit mode
  const allowEditItem = (id: string) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.map((item) =>
        item.i === id ? { ...item, static: !item.static, isDraggable: !item.isDraggable } : item
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
    addItem,
    onTakeItem,
    onPutItem,
    onRemoveToolboxItem,
    updateItem,
    allowEditItem,
    toggleEditMode,
    setLayouts,
  };
};