import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer position={"top-center"} closeButton={false} autoClose={2000} />
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
