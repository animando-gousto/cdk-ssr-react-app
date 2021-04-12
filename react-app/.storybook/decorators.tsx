import { ThemeProvider } from 'styled-components';
import theme from '../src/theme';
import { BrowserRouter as Router } from 'react-router-dom';

export const themeDecorator = (Story: React.ComponentType) => <ThemeProvider theme={theme}><Story /></ThemeProvider>
export const routerDecorator = (Story: React.ComponentType) => <Router><Story /></Router>
