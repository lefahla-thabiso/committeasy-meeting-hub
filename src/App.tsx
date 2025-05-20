
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Documents from './pages/Documents';
import Index from './pages/Index';
import ActionItems from './pages/ActionItems';
import Settings from './pages/Settings';
import Meetings from './pages/Meetings';
import Committees from './pages/Committees';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  // Create a new QueryClient instance
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
              
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/committees" element={<Committees />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/action-items" element={<ActionItems />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
