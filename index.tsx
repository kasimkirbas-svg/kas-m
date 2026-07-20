import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeMonitoring } from './services/monitoringService';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

document.documentElement.classList.add('dark');
localStorage.removeItem('theme');
void initializeMonitoring();

createRoot(rootElement).render(<React.StrictMode><App /></React.StrictMode>);