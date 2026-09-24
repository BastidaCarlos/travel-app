import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './context/AppContext.jsx';
import { BrowserRouter } from "react-router";
import { ChakraProvider } from '@chakra-ui/react';
import { system } from './theme/theme.js';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleId = import.meta.env.VITE_GOOGLE_CLIENT_ID; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider clientId={googleId}>
        <BrowserRouter>
          <AppProvider>
            <ChakraProvider value={system}>
              <App />
            </ChakraProvider>
          </AppProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);