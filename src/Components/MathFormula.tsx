import React from "react";
import { ComponentProps, LayoutItem } from "../Types";
import { getDefaultFontSize, getItemTitle, hasTitle, itemSumSize, useNumberInput } from "../Utils";

const MathFormula: React.FC<ComponentProps> = ({ layoutItem, updateItem }) => {
  const calculateMathFormula = (layoutItem: LayoutItem): string => {
    const formula = layoutItem.data?.at(0)?.at(0);
    const x = layoutItem.data?.at(0)?.at(1);

    if (formula && x !== undefined) {
      try {
        // Replace recognized math functions with their Math equivalents
        const sanitizedFormula = formula
          .replace(/[^-()\d/*+.x\s\w]/g, '') // Allow letters for function names
          .replace(/\b(floor|ceil|sqrt|abs|sin|cos|tan|log|exp|pow)\b/g, 'Math.$1') // Map functions to Math
          .replace(/x/g, x.toString()); // Replace 'x' with its value

        // Use Function constructor for safer evaluation
        const result = new Function(`return ${sanitizedFormula}`)();
        return result.toString();
      } catch (e) {
        console.error("Error evaluating formula:", e);
      }
    }
    return "";
  };

  const y = calculateMathFormula(layoutItem);

  const fontSize = (): number => {
    return Math.min((getDefaultFontSize() * itemSumSize(layoutItem, 0.1, 0.4, 0.7)), getDefaultFontSize() + 4);
  };

  return (
    <>
      <div className="item-content" id={hasTitle(layoutItem) || !layoutItem.static ? "math-formula-content" : "math-formula-content-notitle"}>
        {
          <div id={layoutItem.static ? "" : "math-formula-header"}>
            {getItemTitle(layoutItem, updateItem, fontSize(), "math-formula-title")}
            {!layoutItem.static &&
              <input
                id="math-formula-title"
                type="text"
                value={layoutItem.data?.at(0)?.at(0) || ""}
                onChange={(e) => updateItem(layoutItem.i, "data-0", e.target.value)}
                placeholder="Formula (e.g., 2*x+3)"
                style={{ fontSize: fontSize() }}
              />
            }
          </div>
        }
        <div className="item-content" id="math-formula-div">
          {useNumberInput(layoutItem, layoutItem.data?.at(0)?.at(1), 1, undefined, updateItem, fontSize(), layoutItem.isLocked, "math-formula-input")}
          <hr />
          <input
            id="math-formula-result"
            style={{ fontSize: fontSize() * 2 }}
            readOnly={true}
            type="text"
            value={y}
            placeholder="y"
          />
        </div>
      </div >
    </>
  );
};

export default MathFormula;
