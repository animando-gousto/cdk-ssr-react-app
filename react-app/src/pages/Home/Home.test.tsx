import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components'
import HomePage from './HomePage';
import theme from '../../theme'

const wrapWithTheme = (Component: React.ComponentType) => () =>
  <ThemeProvider theme={theme}><Component /></ThemeProvider>

const HomeWithTheme = wrapWithTheme(HomePage)

test('renders learn react link', () => {
  render(<HomeWithTheme />);
  const linkElement = screen.getAllByText(/Home/i);
  linkElement.forEach(el => expect(el).toBeInTheDocument());
});
