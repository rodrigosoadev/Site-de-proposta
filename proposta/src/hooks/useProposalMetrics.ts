
import { useMemo } from 'react';
import { Proposal } from '@/contexts/ProposalContext';

export interface ProposalMetrics {
  totalCount: number;
  totalValue: number;
  recentCount: number; // últimos 30 dias
  averageValue: number;
}

export function useProposalMetrics(proposals: Proposal[]): ProposalMetrics {
  const metrics = useMemo(() => {
    // Cálculo para propostas dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentProposals = proposals.filter(p => {
      const date = new Date(p.createdAt);
      return date >= thirtyDaysAgo;
    });
    
    const totalValue = proposals.reduce((acc, proposal) => acc + proposal.total, 0);
    const averageValue = proposals.length > 0 ? totalValue / proposals.length : 0;
    
    return {
      totalCount: proposals.length,
      totalValue,
      recentCount: recentProposals.length,
      averageValue
    };
  }, [proposals]);
  
  return metrics;
}
