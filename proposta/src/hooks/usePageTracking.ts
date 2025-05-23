
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../utils/analytics';

interface PageTrackingOptions {
  title?: string;
  category?: string;
  businessEvent?: boolean;
}

export function usePageTracking(options: PageTrackingOptions = {}) {
  const location = useLocation();
  const { title, category, businessEvent } = options;

  useEffect(() => {
    // Capturar URL parâmetros sem incluir dados sensíveis
    const sanitizedUrl = new URL(window.location.href);
    sanitizedUrl.search = ''; // Remove query params que podem conter dados sensíveis
    
    // Rastrear visualização de página com dados aprimorados
    analytics.trackPageView(
      location.pathname, 
      title || document.title
    );
    
    // Se esta é uma página crítica para negócios, rastreá-la como um evento separado
    if (businessEvent) {
      analytics.trackEvent('page_view' as any, {
        page_path: location.pathname,
        page_title: title || document.title,
        page_category: category || 'general',
        is_critical_page: true
      });
    }
    
    // Rolar para o topo na mudança de página
    window.scrollTo(0, 0);
  }, [location, title, category, businessEvent]);

  return null;
}

export default usePageTracking;
