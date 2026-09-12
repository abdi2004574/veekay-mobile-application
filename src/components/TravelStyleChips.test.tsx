import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TravelStyleChips } from './TravelStyleChips';

describe('TravelStyleChips', () => {
  it('renders the available styles and forwards the selected style', async () => {
    const onToggle = jest.fn();

    await render(<TravelStyleChips value={["budget"]} onToggle={onToggle} />);

    expect(screen.getByText('Luxury')).toBeTruthy();
    expect(screen.getByText('Budget')).toBeTruthy();
    expect(screen.getByText('Backpacking')).toBeTruthy();

    fireEvent.press(screen.getByText('Backpacking'));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith('backpacking');
  });
});
