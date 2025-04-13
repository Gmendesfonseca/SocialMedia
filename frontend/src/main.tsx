import './index.css';
import App from './App.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  import.meta.env.VITE_APP_PRODUCTION ? (
    <App />
  ) : (
    <StrictMode>
      <App />
    </StrictMode>
  ),
);
