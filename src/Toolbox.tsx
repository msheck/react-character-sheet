import { FunctionComponent, useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { ColorItems, ToolboxProps } from "./Types";
import { useDefaultColors } from "./DefaultColors";
import { resetTemplateInLS } from "./Utils";
import ToolboxItem from "./ToolboxItem";
import Modal from "./Components/Modal";

// Toolbox Component
const Toolbox: FunctionComponent<ToolboxProps> = ({
  items,
  onTakeItem,
  onRemoveItem,
}) => {
  const { defaultColors, setColorType } = useDefaultColors();
  const [isCollapsed, setIsCollapsed] = useState(true);
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

  const resetSheetTemplate = () => {
    if (window.confirm("Are you sure you want to reset the sheet template? This will remove all customizations.")) {
      resetTemplateInLS();
      window.location.reload(); // Reload the page to apply changes
    }
  };

  const modalTemplate = (message: string, defaultColors: ColorItems, propertyName: keyof ColorItems) => {
    return (
      <Modal isOpen={activePicker === propertyName} onClose={closePicker}>
        <h4>{message}</h4>
        <SketchPicker
          color={defaultColors[propertyName]}
          onChange={(color) =>
            setColorType(
              propertyName,
              `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a ?? 1})`
            )
          }
        />
      </Modal>
    );
  }

  return (
    <>
      <div className={`toolbox ${isCollapsed ? "collapsed-toolbox" : ""}`} onClick={handleToggleCollapse}>
        <div className="toolbox-content">
          <div>
            <div className="toolbox-header">
              <h4 className="toolbox-title">Toolbox</h4>
              <button className="reset-layout-button" onClick={resetSheetTemplate} hidden={isCollapsed}>Reset Sheet Template</button>
            </div>
            {!isCollapsed && (
              <div className="toolbox-grid">
                {items.map((item) => (
                  <ToolboxItem
                    key={item.i}
                    item={item}
                    onTakeItem={onTakeItem}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="color-picker-section">
              <h4>Set Colors</h4>
              <div className="color-picker">
                <button onClick={() => openPicker("primaryColor")}>Primary Color<div className="color-preview" style={{ backgroundColor: defaultColors.primaryColor }} /></button>
                <button onClick={() => openPicker("secondaryColor")}>Secondary Color<div className="color-preview" style={{ backgroundColor: defaultColors.secondaryColor }} /></button>
                <button onClick={() => openPicker("accentColor")}>Accent Color<div className="color-preview" style={{ backgroundColor: defaultColors.accentColor }} /></button>
                <button onClick={() => openPicker("borderColor")}>Border Color<div className="color-preview" style={{ backgroundColor: defaultColors.borderColor }} /></button>
                <button onClick={() => openPicker("sheetBackground")}>Sheet Background Color<div className="color-preview" style={{ backgroundColor: defaultColors.sheetBackground }} /></button>
                <button onClick={() => openPicker("itemBackground")}>Item Background Color<div className="color-preview" style={{ backgroundColor: defaultColors.itemBackground }} /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalTemplate("Pick a Primary Color", defaultColors, "primaryColor")}
      {modalTemplate("Pick a Secondary Color", defaultColors, "secondaryColor")}
      {modalTemplate("Pick an Accent Color", defaultColors, "accentColor")}
      {modalTemplate("Pick a Border Color", defaultColors, "borderColor")}
      {modalTemplate("Pick a Sheet Background Color", defaultColors, "sheetBackground")}
      {modalTemplate("Pick an Item Background Color", defaultColors, "itemBackground")}
    </>
  );
};

export default Toolbox;
