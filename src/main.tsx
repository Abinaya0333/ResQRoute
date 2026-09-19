import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { IncidentProvider } from './context/IncidentContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <IncidentProvider>
        <App />
      </IncidentProvider>
    </AuthProvider>
  </StrictMode>,
);
