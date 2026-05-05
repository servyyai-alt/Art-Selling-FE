import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { store, persistor } from './store';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#000',
                color: '#F8F3ED',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                letterSpacing: '0.02em',
                borderRadius: '0',
                padding: '12px 20px',
              },
              success: {
                iconTheme: { primary: '#C9A34E', secondary: '#000' },
              },
            }}
          />
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);