
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import analytics from './utils/analytics'

// Função para lidar com erros não capturados e enviar para analytics
const handleUncaughtErrors = (event: ErrorEvent) => {
  console.error('Erro não capturado:', event.error);
  
  // Registrar erro no analytics
  analytics.trackEvent('error' as any, {
    error_message: event.error?.message || 'Erro desconhecido',
    error_stack: event.error?.stack,
    error_type: 'uncaught_error',
    url: window.location.href
  });
};

// Registrar manipulador de erros globais
window.addEventListener('error', handleUncaughtErrors);

// Registrar manipulador de promessas não tratadas
window.addEventListener('unhandledrejection', (event) => {
  console.error('Rejeição de promessa não tratada:', event.reason);
  
  // Registrar no analytics
  analytics.trackEvent('error' as any, {
    error_message: event.reason?.message || 'Rejeição de promessa não tratada',
    error_stack: event.reason?.stack,
    error_type: 'unhandled_rejection',
    url: window.location.href
  });
});

// Adicionar controle de nível de log em produção
if (import.meta.env.PROD) {
  // Em produção, limitar logs no console
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    // Em produção, suprimir logs não críticos
    // Manter apenas logs essenciais
    if (args[0]?.includes?.('CRITICAL:')) {
      originalConsoleLog(...args);
    }
  };
}

createRoot(document.getElementById("root")!).render(<App />);
