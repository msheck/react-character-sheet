import { FunctionComponent, useEffect, useState } from "react";
import { ToolBoxProps } from "./Types";
import { useDefaultColors } from "./DefaultColors";
import ToolBoxItem from "./ToolBoxItem";
import { SketchPicker } from "react-color";
import Modal from "./Components/Modal";

// ToolBox Component
const ToolBox: FunctionComponent<ToolBoxProps> = ({
  items,
  onTakeItem,
  onRemoveItem,
}) => {
  const { defaultColors, setColorType } = useDefaultColors();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePicker, setActivePicker] = useState<string | null>(null); // Tracks which picker is open

  const handleToggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  const openPicker = (picker: string) => {
    setActivePicker(picker);
  };

  const closePicker = () => {
    setActivePicker(null);
  };

  return (
    <>
      <div className={`toolbox ${isCollapsed ? "collapsedToolbox" : ""}`} onClick={handleToggleCollapse}>
        <h4 className="toolbox-title">Toolbox</h4>
        {!isCollapsed && (
          <div className="toolbox-content">
            <div className="toolbox-grid">
              {items.map((item) => (
                <ToolBoxItem
                  key={item.i}
                  item={item}
                  onTakeItem={onTakeItem}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </div>
            <div className="color-picker-section">
              <h5>Set Colors</h5>
              <div className="color-picker">
                <button onClick={() => openPicker("primaryColor")}>Set Primary Color</button>
                <button onClick={() => openPicker("secondaryColor")}>Set Secondary Color</button>
                <button onClick={() => openPicker("accentColor")}>Set Accent Color</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={activePicker === "primaryColor"} onClose={closePicker}>
        <h5>Pick Primary Color</h5>
        <SketchPicker
          color={defaultColors.primaryColor}
          onChange={(color) => setColorType("primaryColor", color.hex)}
        />
      </Modal>

      <Modal isOpen={activePicker === "secondaryColor"} onClose={closePicker}>
        <h5>Pick Secondary Color</h5>
        <SketchPicker
          color={defaultColors.secondaryColor}
          onChange={(color) => setColorType("secondaryColor", color.hex)}
        />
      </Modal>

      <Modal isOpen={activePicker === "accentColor"} onClose={closePicker}>
        <h5>Pick Accent Color</h5>
        <SketchPicker
          color={defaultColors.accentColor}
          onChange={(color) => setColorType("accentColor", color.hex)}
        />
      </Modal>
    </>
  );
};

export default ToolBox;