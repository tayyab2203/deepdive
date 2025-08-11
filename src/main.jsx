import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
import { ChatProvider } from './context/ChatContext.jsx'; // ✅ Import ChatProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ChatProvider> {/* ✅ Wrap App with ChatProvider */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  </StrictMode>
);
