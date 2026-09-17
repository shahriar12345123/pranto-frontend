import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
