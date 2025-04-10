import { FunctionComponent, useState } from "react";
import { ToolBoxProps } from "./Types";
import ToolBoxItem from "./ToolBoxItem";
import { SketchPicker } from "react-color";
import Modal from "./Components/Modal"; // Import the Modal component

// ToolBox Component
const ToolBox: FunctionComponent<ToolBoxProps> = ({
  items,
  onTakeItem,
  onRemoveItem,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [accentColor, setAccentColor] = useState("#ff0000");
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
                <button onClick={() => openPicker("primary")}>Set Primary Color</button>
                <button onClick={() => openPicker("secondary")}>Set Secondary Color</button>
                <button onClick={() => openPicker("accent")}>Set Accent Color</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={activePicker === "primary"} onClose={closePicker}>
        <h5>Pick Primary Color</h5>
        <SketchPicker
          color={primaryColor}
          onChangeComplete={(color) => setPrimaryColor(color.hex)}
        />
      </Modal>

      <Modal isOpen={activePicker === "secondary"} onClose={closePicker}>
        <h5>Pick Secondary Color</h5>
        <SketchPicker
          color={secondaryColor}
          onChangeComplete={(color) => setSecondaryColor(color.hex)}
        />
      </Modal>

      <Modal isOpen={activePicker === "accent"} onClose={closePicker}>
        <h5>Pick Accent Color</h5>
        <SketchPicker
          color={accentColor}
          onChangeComplete={(color) => setAccentColor(color.hex)}
        />
      </Modal>
    </>
  );
};

export default ToolBox;