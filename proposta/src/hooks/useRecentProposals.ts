
import { useMemo } from 'react';
import { Proposal } from '@/contexts/ProposalContext';

export interface ProposalWithStatus extends Proposal {
  statusLabel: 'nova' | 'recente' | 'anterior';
}

export function useRecentProposals(proposals: Proposal[], limit: number = 5): ProposalWithStatus[] {
  const recentProposals = useMemo(() => {
    // Ordenar propostas por data de criação (mais recente primeiro)
    const sorted = [...proposals].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Adicionar status baseado na data
    return sorted.slice(0, limit).map(proposal => {
      const proposalDate = new Date(proposal.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - proposalDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let statusLabel: 'nova' | 'recente' | 'anterior' = 'anterior';
      
      if (diffDays < 1) {
        statusLabel = 'nova';
      } else if (diffDays < 7) {
        statusLabel = 'recente';
      }
      
      return {
        ...proposal,
        statusLabel
      };
    });
  }, [proposals, limit]);
  
  return recentProposals;
}
