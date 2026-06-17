import { MantineProvider, createTheme } from '@mantine/core';
import { createRoot } from 'react-dom/client';
import App from './App';

const theme = createTheme({
  primaryColor: 'blue',
  headings: {
    fontWeight: '600',
  },
});

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');
createRoot(rootEl).render(
  <MantineProvider theme={theme} forceColorScheme="dark">
    <App />
  </MantineProvider>,
);
