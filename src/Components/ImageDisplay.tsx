import React, { useRef } from "react";
import { ComponentProps } from "../Types";
import { getDefaultFontSize, getItemTitle, hasTitle, itemSumSize } from "../Utils";

const ImageDisplay: React.FC<ComponentProps> = ({ layoutItem, updateItem }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fontSize = (): number => {
    return Math.min(
      getDefaultFontSize() * itemSumSize(layoutItem, 0.1, 0.4, 0.8),
      getDefaultFontSize() + 4
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateItem(layoutItem.i, "data-0", event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageRemove = () => {
    if (window.confirm("Remove this image?")) {
      updateItem(layoutItem.i, "data-0", "");
    }
  };

  return (
    <div
      className="item-content"
      id={
        hasTitle(layoutItem) || !layoutItem.static
          ? "image-display-content"
          : "image-display-content-notitle"
      }
    >
      {getItemTitle(layoutItem, updateItem, fontSize())}
      <div className="display-area">
        {
          layoutItem.data?.at(0)?.at(0) ?
            (
              <>
                <img
                  className="displayed-image"
                  src={layoutItem.data?.at(0)?.at(0)}
                  alt="Uploaded"
                />
                <span
                  className={`${layoutItem.static ? "remove-image-hidden" : "remove-image"} remove-button`}
                  onMouseDown={e => { e.stopPropagation(); handleImageRemove(); }}
                >
                  &times;
                </span>
              </>
            ) :
            (!layoutItem.isLocked &&
              <button
                type="button"
                className="upload-button"
                onMouseDown={e => { e.stopPropagation(); handleUploadClick(); }}
              >
                Upload Image
              </button>
            )
        }
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </div>
    </div >
  );
};

export default ImageDisplay;