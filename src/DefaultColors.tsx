import { useEffect, useState } from 'react';
import { getColorsFromLS, saveColorsToLS } from './Utils';

export const useDefaultColors = () => {
  const [defaultColors, setDefaultColors] = useState(getColorsFromLS());

  const setColorType = (colorType: string, color: string) => {
    setDefaultColors((prevColors) => ({
      ...prevColors,
      [colorType]: color,
    }));
  }

  useEffect(() => {
    saveColorsToLS(defaultColors);
  }, [defaultColors]);

  return { defaultColors, setDefaultColors, setColorType };
}