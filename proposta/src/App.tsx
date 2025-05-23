
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { ProposalProvider } from './contexts/ProposalContext';
import { SignatureProvider } from './contexts/SignatureContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/ProtectedRoute';
import AnalyticsTracker from './components/AnalyticsTracker';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import CreateProposal from './pages/CreateProposal';
import ProposalsList from './pages/ProposalsList';
import ViewProposal from './pages/ViewProposal';
import Plans from './pages/Plans';
import SignaturePage from './pages/SignaturePage';
import AuthCallback from './pages/AuthCallback';
import CreateContract from './pages/CreateContract';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <ProposalProvider>
              <SignatureProvider>
                <AnalyticsTracker />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/propostas" element={<ProtectedRoute><ProposalsList /></ProtectedRoute>} />
                  <Route path="/propostas/nova" element={<ProtectedRoute><CreateProposal /></ProtectedRoute>} />
                  <Route path="/propostas/:id" element={<ProtectedRoute><ViewProposal /></ProtectedRoute>} />
                  <Route path="/contratos/novo" element={<ProtectedRoute><CreateContract /></ProtectedRoute>} />
                  <Route path="/planos" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
                  <Route path="/assinatura/:token" element={<SignaturePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </SignatureProvider>
            </ProposalProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
