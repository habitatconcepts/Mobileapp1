import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ColorPicker from '../../src/components/ColorPicker';

describe('ColorPicker Component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<ColorPicker />);
    expect(getByTestId('color-picker')).toBeTruthy();
  });

  it('changes color when a color is selected', () => {
    const { getByTestId } = render(<ColorPicker />);
    const colorButton = getByTestId('color-button-red'); // Assuming there's a button for red color
    fireEvent.press(colorButton);
    expect(getByTestId('selected-color')).toHaveStyle({ backgroundColor: 'red' });
  });

  it('calls the onChange callback when a color is selected', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<ColorPicker onChange={mockOnChange} />);
    const colorButton = getByTestId('color-button-blue'); // Assuming there's a button for blue color
    fireEvent.press(colorButton);
    expect(mockOnChange).toHaveBeenCalledWith('blue');
  });
});