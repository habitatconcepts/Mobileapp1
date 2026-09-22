import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import ColorPicker, { colorPalette } from '../../src/components/ColorPicker';

describe('ColorPicker', () => {
  it('renders the palette swatches', async () => {
    const { getByTestId } = await render(
      <ColorPicker selectedColor="#FF5733" onSelectColor={() => {}} />,
    );
    expect(getByTestId('color-picker')).toBeTruthy();
    expect(colorPalette().length).toBeGreaterThan(4);
    colorPalette().forEach((color) => {
      expect(getByTestId(`color-swatch-${color}`)).toBeTruthy();
    });
  });

  it('calls onSelectColor with the tapped swatch color', async () => {
    const onSelectColor = jest.fn();
    const { getByTestId } = await render(
      <ColorPicker selectedColor="#FF5733" onSelectColor={onSelectColor} />,
    );
    await fireEvent.press(getByTestId('color-swatch-#33FF57'));
    expect(onSelectColor).toHaveBeenCalledWith('#33FF57');
  });

  it('shows the currently selected color', async () => {
    const { getByTestId } = await render(
      <ColorPicker selectedColor="#33FF57" onSelectColor={() => {}} />,
    );
    const style = StyleSheet.flatten(getByTestId('selected-color').props.style);
    expect(style).toMatchObject({ backgroundColor: '#33FF57' });
  });
});
