import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('provides a skip link to the main content', () => {
  render(<App />);

  const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
  const mainContent = screen.getByRole('main');

  expect(skipLink).toHaveAttribute('href', '#main-content');
  expect(mainContent).toHaveAttribute('id', 'main-content');
  expect(mainContent).toHaveAttribute('tabIndex', '-1');
});
