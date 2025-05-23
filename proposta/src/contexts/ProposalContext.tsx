import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSubscription } from './SubscriptionContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ProposalItem {
  id: string;
  name: string;
  value: number;
}

export interface Proposal {
  id: string;
  clientName: string;
  description: string;
  items: ProposalItem[];
  total: number;
  deliveryDate: string;
  validUntil: string;
  additionalNotes?: string;
  createdAt: string;
  userId: string;
  template?: string;
  includeContract?: boolean;
}

interface ProposalContextType {
  proposals: Proposal[];
  getProposal: (id: string) => Proposal | null;
  createProposal: (proposal: Omit<Proposal, 'id' | 'createdAt' | 'userId'>) => Promise<Proposal | null>;
  updateProposal: (id: string, proposal: Partial<Proposal>) => Promise<void>;
  deleteProposal: (id: string) => Promise<void>;
  filteredProposals: Proposal[]; // Filtered by subscription plan
  isLoading: boolean;
}

const ProposalContext = createContext<ProposalContextType | undefined>(undefined);

export function ProposalProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { plan, incrementUsedProposals, canCreateNewProposal } = useSubscription();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch proposals using React Query
  const { 
    data: proposals = [], 
    isLoading 
  } = useQuery({
    queryKey: ['proposals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          id,
          client_name,
          description,
          total,
          delivery_date,
          valid_until,
          additional_notes,
          created_at,
          user_id,
          template,
          include_contract,
          proposal_items (
            id,
            name,
            value
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching proposals:', error);
        throw error;
      }
      
      // Transform to match our interface
      return data.map(item => ({
        id: item.id,
        clientName: item.client_name,
        description: item.description || '',
        total: Number(item.total),
        deliveryDate: item.delivery_date,
        validUntil: item.valid_until,
        additionalNotes: item.additional_notes || undefined,
        createdAt: item.created_at,
        userId: item.user_id,
        template: item.template || undefined,
        includeContract: item.include_contract || false,
        items: item.proposal_items.map((pi: any) => ({
          id: pi.id,
          name: pi.name,
          value: Number(pi.value)
        }))
      }));
    },
    enabled: isAuthenticated
  });

  // Create proposal mutation
  const createProposalMutation = useMutation({
    mutationFn: async (proposalData: Omit<Proposal, 'id' | 'createdAt' | 'userId'>) => {
      if (!user) throw new Error("Usuário não autenticado");
      if (!canCreateNewProposal) throw new Error("Limite de propostas atingido");
      
      // Start a Supabase transaction using RPC (if possible) or multiple operations
      // 1. Insert the proposal
      const { data: proposal, error: proposalError } = await supabase
        .from('proposals')
        .insert({
          client_name: proposalData.clientName,
          description: proposalData.description,
          total: proposalData.total,
          delivery_date: proposalData.deliveryDate,
          valid_until: proposalData.validUntil,
          additional_notes: proposalData.additionalNotes,
          user_id: user.id,
          template: proposalData.template,
          include_contract: proposalData.includeContract
        })
        .select('*')
        .single();
        
      if (proposalError) throw proposalError;
      
      // 2. Insert the proposal items
      const proposalItems = proposalData.items.map(item => ({
        proposal_id: proposal.id,
        name: item.name,
        value: item.value
      }));
      
      const { error: itemsError } = await supabase
        .from('proposal_items')
        .insert(proposalItems);
        
      if (itemsError) throw itemsError;
      
      // 3. If includeContract is true, create a contract for the proposal
      if (proposalData.includeContract) {
        const contractContent = `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: ${proposalData.clientName}
CONTRATADO: ${user.name || "Nome do Contratado"} ${user.companyName ? `- ${user.companyName}` : ""}

OBJETO DO CONTRATO:
${proposalData.description || "Prestação de serviços conforme detalhado na proposta."}

VALOR E CONDIÇÕES DE PAGAMENTO:
O valor total dos serviços é de ${new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(proposalData.total)}, a serem pagos nas condições estabelecidas na proposta.

PRAZO DE EXECUÇÃO:
Os serviços serão prestados até ${new Date(proposalData.deliveryDate).toLocaleDateString('pt-BR')}.

OBRIGAÇÕES DO CONTRATADO:
1. Executar os serviços conforme especificações da proposta;
2. Utilizar profissionais habilitados para a execução dos serviços;
3. Responsabilizar-se por todos os encargos trabalhistas, previdenciários e fiscais;
4. Manter sigilo sobre todas as informações confidenciais do CONTRATANTE.

OBRIGAÇÕES DO CONTRATANTE:
1. Fornecer todas as informações necessárias para a execução dos serviços;
2. Efetuar os pagamentos nas condições e prazos estabelecidos;
3. Comunicar ao CONTRATADO qualquer irregularidade na prestação dos serviços.

CLÁUSULAS ADICIONAIS:
${proposalData.additionalNotes || "Não há cláusulas adicionais."}

FORO:
Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o foro da comarca de ${user.location || "[Local do Contratado]"}.

Data: ${new Date().toLocaleDateString('pt-BR')}

________________________________
${proposalData.clientName}
CONTRATANTE

________________________________
${user.name || "Nome do Contratado"}
CONTRATADO
    `.trim();
        
        const { error: contractError } = await supabase
          .from('contracts')
          .insert({
            proposal_id: proposal.id,
            content: contractContent,
            status: 'draft'
          });
          
        if (contractError) {
          console.error('Error creating contract:', contractError);
          // Non-blocking error, we still want to return the proposal
        }
      }
      
      // Transform data to match our interface
      const createdProposal: Proposal = {
        id: proposal.id,
        clientName: proposal.client_name,
        description: proposal.description || '',
        total: Number(proposal.total),
        deliveryDate: proposal.delivery_date,
        validUntil: proposal.valid_until,
        additionalNotes: proposal.additional_notes || undefined,
        createdAt: proposal.created_at,
        userId: proposal.user_id,
        template: proposal.template || undefined,
        includeContract: proposal.include_contract || false,
        items: proposalData.items.map((item, index) => ({
          ...item,
          id: `temp-${index}` // We'll get actual IDs when we refresh data
        }))
      };
      
      return createdProposal;
    },
    onSuccess: () => {
      incrementUsedProposals();
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({
        title: "Proposta criada",
        description: "Sua proposta foi criada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar proposta",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update proposal mutation
  const updateProposalMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Proposal> }) => {
      if (!user) throw new Error("Usuário não autenticado");
      
      // First update the proposal
      const { error: proposalError } = await supabase
        .from('proposals')
        .update({
          client_name: data.clientName,
          description: data.description,
          total: data.total,
          delivery_date: data.deliveryDate,
          valid_until: data.validUntil,
          additional_notes: data.additionalNotes,
          template: data.template,
          include_contract: data.includeContract
        })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (proposalError) throw proposalError;
      
      // If we're updating items, handle it separately
      if (data.items) {
        // Delete existing items first
        const { error: deleteError } = await supabase
          .from('proposal_items')
          .delete()
          .eq('proposal_id', id);
          
        if (deleteError) throw deleteError;
        
        // Then insert new items
        const proposalItems = data.items.map(item => ({
          proposal_id: id,
          name: item.name,
          value: item.value
        }));
        
        const { error: itemsError } = await supabase
          .from('proposal_items')
          .insert(proposalItems);
          
        if (itemsError) throw itemsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({
        title: "Proposta atualizada",
        description: "Sua proposta foi atualizada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar proposta",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete proposal mutation
  const deleteProposalMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Usuário não autenticado");
      
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({
        title: "Proposta excluída",
        description: "Sua proposta foi excluída com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir proposta",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Get filtered proposals based on plan
  const filteredProposals = React.useMemo(() => {
    if (plan === 'free') {
      // Free plan sees only the last 3 proposals
      return [...proposals].slice(0, 3);
    }
    return proposals;
  }, [proposals, plan]);

  // Get a single proposal by ID - Alterado para sincronizar com o cache local
  const getProposal = (id: string): Proposal | null => {
    if (!user) return null;
    
    // Primeiro tenta buscar do cache local
    const cachedProposal = proposals.find(p => p.id === id);
    if (cachedProposal) {
      return cachedProposal;
    }
    
    // Se não encontrou no cache, retorna null
    return null;
  };

  // Expose methods with Supabase implementation
  const createProposal = async (proposalData: Omit<Proposal, 'id' | 'createdAt' | 'userId'>) => {
    return createProposalMutation.mutateAsync(proposalData);
  };

  const updateProposal = async (id: string, data: Partial<Proposal>) => {
    return updateProposalMutation.mutateAsync({ id, data });
  };

  const deleteProposal = async (id: string) => {
    return deleteProposalMutation.mutateAsync(id);
  };

  return (
    <ProposalContext.Provider value={{
      proposals,
      filteredProposals,
      getProposal,
      createProposal,
      updateProposal,
      deleteProposal,
      isLoading
    }}>
      {children}
    </ProposalContext.Provider>
  );
}

export function useProposals() {
  const context = useContext(ProposalContext);
  if (context === undefined) {
    throw new Error('useProposals must be used within a ProposalProvider');
  }
  return context;
}
