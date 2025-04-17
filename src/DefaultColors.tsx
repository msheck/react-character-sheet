import { useEffect, useState } from 'react';
import { getColorsFromLS, saveColorsToLS } from './Utils';

export const useDefaultColors = () => {
  const [defaultColors, setDefaultColors] = useState(
    getColorsFromLS() ?? {
      primaryColor: "rgba(50,50,50,1)",
      secondaryColor: "rgba(80,80,80,1)",
      accentColor: "rgba(100,150,255,0.8)",
      sheetBackground: "rgba(245,245,250,1)",
      itemBackground: "rgba(223,223,223,1)",
      accentBackground: " rgba(235,235,212,0.8)",
    });

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