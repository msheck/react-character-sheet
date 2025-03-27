import { LayoutItem, Layouts } from "./Types";
import { getFromLS } from "./Utils";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

export const useSheetFunctions = () => {
  const [layouts, setLayouts] = useState<Layouts>({
    lg: getFromLS("layout") || [],
  });

  const [toolbox, setToolbox] = useState<Layouts>({
    lg: getFromLS("toolbox").length === 0
      ? [
        { x: 0, y: 0, w: 2, h: 2, i: "toolbox-item-1", title: "Toolbox Item 1" },
        { x: 0, y: 0, w: 2, h: 2, i: "toolbox-item-2", title: "title" },
      ]
      : getFromLS("toolbox"),
  });

  const [editMode, setEditMode] = useState(false);

  // Function to add a new element with a unique ID
  const addItem = () => {
    const newItem: LayoutItem = {
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      i: uuidv4(),
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
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      lg: prevToolbox.lg.filter(({ i }) => i !== item.i),
    }));
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: [...prevLayouts.lg, { ...item, static: !editMode, isDraggable: editMode }], // Set static and isDraggable based on editMode
    }));
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
  const updateItem = (id: string, field: "title" | "description", value: string) => {
    setLayouts((prevLayouts) => ({
      ...prevLayouts,
      lg: prevLayouts.lg.map((item) =>
        item.i === id ? { ...item, [field]: value } : item
      ),
    }));
  };

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