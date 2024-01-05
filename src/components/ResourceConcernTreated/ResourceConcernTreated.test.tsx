import { cleanup, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import ResourceConcernTreated from './ResourceConcernTreated';
import { createTestStore } from '../../Redux/store';

afterEach(() => {
  cleanup();
});

describe('Verify ResourceConcernList is rendered correctly', () => {
  const store = createTestStore();

  test('Verify ResourceConcernTreated component', async () => {
    // Create a redux store
    const { findByText } = render(
      <Provider store={store}>
        <ResourceConcernTreated />
      </Provider>
    );
    await findByText('Soil');
  });
  test('Verify tabs open and close', async () => {
    render(
      <Provider store={store}>
        <ResourceConcernTreated />
      </Provider>
    );
    userEvent.click(screen.getByText('Water'));
    expect(screen.getByText('Positive Effects'));
    userEvent.click(screen.getByText('Water'));
    expect(screen.queryByText('Positive Effects')).not.toBeInTheDocument();
  });
});
