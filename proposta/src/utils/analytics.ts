
type EventName = 
  | 'page_view'
  | 'login'
  | 'signup'
  | 'proposal_created'
  | 'proposal_updated'
  | 'proposal_sent'
  | 'signature_requested'
  | 'signature_completed'
  | 'plan_upgraded'
  | 'pdf_exported'
  | 'contract_created'
  | 'proposal_shared';

interface EventProperties {
  [key: string]: string | number | boolean | null;
}

class Analytics {
  private initialized = false;

  init() {
    if (this.initialized) return;
    
    // Configurado com o ID de produção real
    const ga4Id = 'G-MGYN971JDP';
    
    // Script do Google Analytics
    if (ga4Id && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
      document.head.appendChild(script);
      
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', ga4Id, {
        send_page_view: false, // Rastreamos páginas manualmente
        cookie_domain: window.location.hostname, // Usa automaticamente o domínio correto
        cookie_flags: 'SameSite=None;Secure', // Segurança aprimorada para cookies
        anonymize_ip: true // Melhoria de privacidade para GDPR/LGPD
      });
      
      this.initialized = true;
      console.log('Analytics inicializado com ID:', ga4Id);
    }
  }
  
  trackPageView(path: string, title?: string) {
    if (!this.initialized) this.init();
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.href
      });
    }
  }
  
  trackEvent(name: EventName, properties?: EventProperties) {
    if (!this.initialized) this.init();
    
    if (typeof window !== 'undefined' && window.gtag) {
      // Adiciona timestamp a todos os eventos
      const enrichedProperties = {
        ...properties,
        event_time: new Date().toISOString(),
        environment: import.meta.env.MODE || 'production'
      };
      
      window.gtag('event', name, enrichedProperties);
      
      // Apenas registra em desenvolvimento, não em produção
      if (import.meta.env.MODE !== 'production') {
        console.log(`Evento rastreado: ${name}`, enrichedProperties);
      }
    }
  }
}

// Interface para o objeto window
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const analytics = new Analytics();
export default analytics;
