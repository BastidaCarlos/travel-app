import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './context/AppContext.jsx';
import { BrowserRouter } from "react-router";
import { ChakraProvider } from '@chakra-ui/react';
import { system } from './theme/theme.js';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ChakraProvider value={system}>
          <App />
        </ChakraProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);