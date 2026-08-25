import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/main.css';
import './styles/polish.css';
import './styles/glass.css';
import './styles/seasonal.css';
import './styles/data.css';
import './styles/tools.css';
import './styles/evergreen.css';
import './styles/scale.css';

const rootElement = document.getElementById('root')!;
const app = <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>;

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}
