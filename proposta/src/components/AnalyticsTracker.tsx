
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import analytics from '@/utils/analytics';
import { useSubscription } from '@/contexts/SubscriptionContext';

const AnalyticsTracker: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { plan } = useSubscription();

  // Inicializar analytics
  useEffect(() => {
    analytics.init();
  }, []);

  // Rastrear visualizações de página
  useEffect(() => {
    analytics.trackPageView(location.pathname);
  }, [location]);

  // Rastrear alterações no estado de autenticação
  useEffect(() => {
    if (isAuthenticated && user) {
      // Enviar dados do usuário para analytics (sem dados pessoais)
      analytics.trackEvent('login', {
        user_id: user.id, // Isso é OK pois é apenas um UUID
        has_company: !!user.companyName,
        has_logo: !!user.companyLogo,
        subscription_plan: plan || 'free' // Usando o plano do contexto de assinatura
      });
    }
  }, [isAuthenticated, user, plan]);

  return null; // Este componente não renderiza nada visualmente
};

export default AnalyticsTracker;
