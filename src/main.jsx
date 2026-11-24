import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { SusuProvider } from './Context/SusuContext.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SusuProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SusuProvider>
  </React.StrictMode>
);