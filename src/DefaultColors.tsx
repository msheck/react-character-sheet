import { useEffect, useState } from 'react';
import { getColorsFromLS, saveColorsToLS } from './Utils';

export const useDefaultColors = () => {
  const [defaultColors, setDefaultColors] = useState(
    getColorsFromLS() ?? {
      primaryColor: "rgba(50,50,50,1)",
      secondaryColor: "rgba(80,80,80,1)",
      accentColor: "rgba(100,150,255,0.8)",
      sheetBackground: "rgba(245,245,250,1)",
      itemBackground: "rgba(230,230,230,1)",
      accentBackground: "rgba(165,165,130,0.8)",
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

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', defaultColors.primaryColor);
  }, [defaultColors.primaryColor]);

  useEffect(() => {
    document.documentElement.style.setProperty('--secondary-color', defaultColors.secondaryColor);
  }, [defaultColors.secondaryColor]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', defaultColors.accentColor);
  }, [defaultColors.accentColor]);

  useEffect(() => {
    document.documentElement.style.setProperty('--sheet-background', defaultColors.sheetBackground);
  }, [defaultColors.sheetBackground]);

  useEffect(() => {
    document.documentElement.style.setProperty('--item-background', defaultColors.itemBackground);
  }, [defaultColors.itemBackground]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-background', defaultColors.accentBackground);
  }, [defaultColors.accentBackground]);

  return { defaultColors, setDefaultColors, setColorType };
}