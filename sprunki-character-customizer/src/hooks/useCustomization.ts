import { useState } from 'react';
import { CustomizationOptions } from '../types/customization';

const useCustomization = () => {
  const [customization, setCustomization] = useState<CustomizationOptions>({
    outfit: null,
    accessories: [],
    color: null,
    expression: null,
    background: null,
  });

  const updateOutfit = (outfit: string) => {
    setCustomization((prev) => ({ ...prev, outfit }));
  };

  const addAccessory = (accessory: string) => {
    setCustomization((prev) => ({
      ...prev,
      accessories: [...prev.accessories, accessory],
    }));
  };

  const removeAccessory = (accessory: string) => {
    setCustomization((prev) => ({
      ...prev,
      accessories: prev.accessories.filter((acc) => acc !== accessory),
    }));
  };

  const updateColor = (color: string) => {
    setCustomization((prev) => ({ ...prev, color }));
  };

  const updateExpression = (expression: string) => {
    setCustomization((prev) => ({ ...prev, expression }));
  };

  const updateBackground = (background: string) => {
    setCustomization((prev) => ({ ...prev, background }));
  };

  return {
    customization,
    updateOutfit,
    addAccessory,
    removeAccessory,
    updateColor,
    updateExpression,
    updateBackground,
  };
};

export default useCustomization;