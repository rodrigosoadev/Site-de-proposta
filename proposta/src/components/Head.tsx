
import { useEffect } from 'react';

interface HeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
}

const DEFAULT_TITLE = 'PropostaPro - Crie e assine propostas online';
const DEFAULT_DESCRIPTION = 'PropostaPro é a plataforma para profissionais e empresas criarem, enviarem e assinarem propostas comerciais digitalmente.';
const DEFAULT_IMAGE = '/logo.png';
const PRODUCTION_URL = 'https://elegant-biz-proposals.vercel.app'; // Updated production URL

const Head: React.FC<HeadProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  canonical,
}) => {
  const fullTitle = title ? `${title} | PropostaPro` : DEFAULT_TITLE;
  // Garantir URLs absolutas para compartilhamento em mídia social
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${PRODUCTION_URL}${ogImage}`;
  const absoluteCanonical = canonical ? (canonical.startsWith('http') ? canonical : `${PRODUCTION_URL}${canonical}`) : undefined;
  
  useEffect(() => {
    // Atualizar título do documento
    document.title = fullTitle;
    
    // Atualizar meta tags
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    // Atualizar tags OG
    const updateOgMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateMeta('description', description);
    updateOgMeta('og:title', fullTitle);
    updateOgMeta('og:description', description);
    updateOgMeta('og:image', absoluteOgImage);
    updateOgMeta('og:type', ogType);
    updateOgMeta('og:site_name', 'PropostaPro');
    updateOgMeta('twitter:card', 'summary_large_image');
    
    // Manipular URL canônica
    if (absoluteCanonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', absoluteCanonical);
    }
    
    // Adicionar meta tag responsiva para dispositivos móveis
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5');
      document.head.appendChild(viewportMeta);
    }
    
    // Adicionar meta tag de tema de cor para navegadores móveis
    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.setAttribute('name', 'theme-color');
      themeMeta.setAttribute('content', '#0066cc'); // Cor primária
      document.head.appendChild(themeMeta);
    }
  }, [fullTitle, description, absoluteOgImage, ogType, absoluteCanonical]);
  
  return null;
};

export default Head;
