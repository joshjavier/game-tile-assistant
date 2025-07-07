import { render, screen, userEvent } from '@test-utils';
import { createRoutesStub } from 'react-router';
import { LabelPicker } from './LabelPicker';

function renderComponent(initialEntry = '/betmgm/nj') {
  const Stub = createRoutesStub([
    {
      path: '/:brand/:state?',
      Component: LabelPicker,
    },
  ]);

  render(<Stub initialEntries={[initialEntry]} />);
}

describe('LabelPicker component', () => {
  it('has a button that shows "Pick a label" when loaded on an invalid label', () => {
    renderComponent('/partycasino/on'); // NJ is the only state for PartyCasino, so this is invalid
    expect(screen.getByRole('button', { name: /pick a label/i })).toBeVisible();
  });

  describe('when loaded on a valid label', () => {
    it('has a button that shows the current label', () => {
      renderComponent();
      expect(screen.getByRole('button', { name: /betmgm nj/i })).toBeVisible();
    });

    it('shows a dropdown of available labels when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('listbox')).toBeVisible();
      expect(screen.getAllByRole('option')).toHaveLength(10);
    });

    it('changes the button text when a new label is selected', async () => {
      const user = userEvent.setup();
      renderComponent();

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('option', { name: /betmgm on/i }));
      expect(screen.queryByRole('listbox')).toBeNull();
      expect(screen.getByRole('button', { name: /betmgm on/i })).toBeVisible();
    });
  });
});
