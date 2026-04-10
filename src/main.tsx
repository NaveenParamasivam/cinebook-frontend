import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 2 * 60 * 1000, refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={qc}>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1C1917', color: '#F5F0E8', border: '1px solid #3C3836', borderRadius: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px' },
          success: { iconTheme: { primary: '#4A6741', secondary: '#F5F0E8' } },
          error:   { iconTheme: { primary: '#8B1A2B', secondary: '#F5F0E8' } },
        }} />
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
