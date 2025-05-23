
export type PlanType = 'free' | 'intermediate' | 'professional';

export interface PlanFeature {
  name: string;
  included: boolean;
  description: string;
  highlight?: boolean;
}

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  proposalsLimit: number;
  color: string;
  features: PlanFeature[];
  recommended?: boolean;
}

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    proposalsLimit: 2,
    color: 'gray',
    features: [
      { name: 'Até 2 propostas por mês', included: true, description: 'Limite mensal de geração' },
      { name: 'Marca d\'água no PDF', included: true, description: 'Criado com PropostaPro' },
      { name: 'Histórico limitado', included: true, description: 'Acesso aos últimos 3 registros' },
      { name: 'Personalização', included: false, description: 'Sem personalização visual' },
      { name: 'Upload de logo', included: false, description: 'Não disponível' },
      { name: 'Suporte', included: false, description: 'Sem suporte personalizado' },
    ]
  },
  {
    id: 'intermediate',
    name: 'Intermediário',
    price: 29.90,
    proposalsLimit: 10,
    color: 'blue',
    recommended: true,
    features: [
      { name: 'Até 10 propostas por mês', included: true, description: 'Limite mensal de geração', highlight: true },
      { name: 'Sem marca d\'água', included: true, description: 'PDF limpo e profissional', highlight: true },
      { name: 'Histórico completo', included: true, description: 'Acesso a todo o histórico de propostas' },
      { name: 'Temas básicos', included: true, description: '2 temas personalizáveis' },
      { name: 'Upload de logo', included: true, description: 'Adicione sua marca' },
      { name: 'Suporte por email', included: true, description: 'Resposta em até 48h' },
    ]
  },
  {
    id: 'professional',
    name: 'Profissional',
    price: 59.90,
    proposalsLimit: Infinity,
    color: 'purple',
    features: [
      { name: 'Propostas ilimitadas', included: true, description: 'Sem limites mensais', highlight: true },
      { name: 'Templates premium', included: true, description: '3 templates exclusivos', highlight: true },
      { name: 'Personalização completa', included: true, description: 'Cores, fontes e elementos visuais' },
      { name: 'Link para aprovação', included: true, description: 'Compartilhe com clientes para aprovação online' },
      { name: 'Assinatura eletrônica', included: true, description: 'Confirmação simples por botão' },
      { name: 'Suporte prioritário', included: true, description: 'Resposta em até 24h' },
    ]
  }
];

export function getPlan(planType: PlanType): Plan {
  return plans.find(plan => plan.id === planType) || plans[0]; // Default to free plan
}

export function getProposalsRemaining(planType: PlanType, usedProposals: number): number {
  const plan = getPlan(planType);
  if (plan.proposalsLimit === Infinity) return Infinity;
  return Math.max(0, plan.proposalsLimit - usedProposals);
}

export function canCreateProposal(planType: PlanType, usedProposals: number): boolean {
  return getProposalsRemaining(planType, usedProposals) > 0;
}
