
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Send, Loader2, FileSignature } from "lucide-react";
import { Proposal } from '@/contexts/ProposalContext';
import { useSignature } from '@/contexts/SignatureContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import RequestSignatureModal from './signature/RequestSignatureModal';
import ViewSignatureRequests from './signature/ViewSignatureRequests';
import { supabase } from '@/integrations/supabase/client';

interface ProposalApprovalBannerProps {
  proposal: Proposal;
}

export default function ProposalApprovalBanner({ proposal }: ProposalApprovalBannerProps) {
  const { toast } = useToast();
  const { plan, showShareUpgradeModal } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [contractId, setContractId] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showViewRequestsModal, setShowViewRequestsModal] = useState(false);
  const [hasSignatureRequests, setHasSignatureRequests] = useState(false);

  // Check if the proposal has any signature requests
  useEffect(() => {
    const checkSignatureRequests = async () => {
      try {
        // First, get contract ID for this proposal
        const { data: contract, error: contractError } = await supabase
          .from('contracts')
          .select('id')
          .eq('proposal_id', proposal.id)
          .single();
          
        if (contractError) {
          console.error("Error fetching contract:", contractError);
          return;
        }
        
        setContractId(contract.id);
        
        // Check if there are any signature requests for this contract
        const { data: requests, error: requestsError } = await supabase
          .from('signature_requests')
          .select('id')
          .eq('contract_id', contract.id);
          
        if (requestsError) {
          console.error("Error checking signature requests:", requestsError);
          return;
        }
        
        setHasSignatureRequests(requests.length > 0);
      } catch (error) {
        console.error("Error checking signature requests:", error);
      }
    };
    
    checkSignatureRequests();
  }, [proposal.id]);

  const handleSendApproval = () => {
    // Check if user is on free plan - if so, show premium feature modal
    if (plan === 'free') {
      showShareUpgradeModal();
      return;
    }

    if (!agreed) {
      toast({
        title: "Confirmação necessária",
        description: "Por favor, confirme os termos antes de enviar para aprovação.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // First, check if there's already a contract for this proposal
    const createOrGetContract = async () => {
      try {
        // Check if contract exists
        const { data: existingContract, error: checkError } = await supabase
          .from('contracts')
          .select('id')
          .eq('proposal_id', proposal.id)
          .single();
        
        if (!checkError && existingContract) {
          return existingContract.id;
        }
        
        // Create contract if it doesn't exist
        const { data: newContract, error: createError } = await supabase
          .from('contracts')
          .insert({
            proposal_id: proposal.id,
            content: generateContractContent(proposal),
            status: 'draft'
          })
          .select('id')
          .single();
        
        if (createError) throw createError;
        
        return newContract.id;
      } catch (error) {
        console.error("Error creating contract:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    createOrGetContract()
      .then(contractId => {
        setContractId(contractId);
        setShowRequestModal(true);
      })
      .catch(error => {
        toast({
          title: "Erro ao criar contrato",
          description: error.message,
          variant: "destructive",
        });
      });
  };

  // Generate contract content based on proposal data
  const generateContractContent = (proposal: Proposal) => {
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: ${proposal.clientName}
CONTRATADO: [Nome do Prestador de Serviços]

OBJETO DO CONTRATO:
${proposal.description || "Prestação de serviços conforme detalhado na proposta."}

VALOR E CONDIÇÕES DE PAGAMENTO:
O valor total dos serviços é de ${new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(proposal.total)}, a serem pagos conforme as seguintes condições:

PRAZO DE EXECUÇÃO:
Os serviços serão prestados no período de ${new Date(proposal.createdAt).toLocaleDateString('pt-BR')} a ${new Date(proposal.deliveryDate).toLocaleDateString('pt-BR')}.

OBRIGAÇÕES DO CONTRATADO:
1. Executar os serviços conforme especificações da proposta;
2. Utilizar profissionais habilitados para a execução dos serviços;
3. Responsabilizar-se por todos os encargos trabalhistas, previdenciários e fiscais decorrentes da execução deste contrato;
4. Manter sigilo sobre todas as informações confidenciais do CONTRATANTE a que tiver acesso.

OBRIGAÇÕES DO CONTRATANTE:
1. Fornecer todas as informações necessárias para a execução dos serviços;
2. Efetuar os pagamentos nas condições e prazos estabelecidos;
3. Comunicar ao CONTRATADO qualquer irregularidade na prestação dos serviços.

CLÁUSULAS ADICIONAIS:
${proposal.additionalNotes || "Não há cláusulas adicionais."}

FORO:
Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o foro da comarca de [Cidade/Estado].

Data: ${currentDate}

______________________________
${proposal.clientName}
CONTRATANTE

______________________________
[Nome do Prestador de Serviços]
CONTRATADO`;
  };

  // Show signature request modal
  const handleViewRequests = () => {
    // Check if user is on free plan - if so, show premium feature modal
    if (plan === 'free') {
      showShareUpgradeModal();
      return;
    }

    if (contractId) {
      setShowViewRequestsModal(true);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível encontrar o contrato para esta proposta.",
        variant: "destructive",
      });
    }
  };

  // Show success state if there are signature requests
  if (hasSignatureRequests) {
    return (
      <>
        <Card className="bg-primary-50 border-primary-200 p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-primary-800">Solicitações de assinatura enviadas</h3>
              <p className="text-sm text-primary-600">
                Esta proposta possui solicitações de assinatura em andamento.
              </p>
            </div>
            
            <Button onClick={handleViewRequests}>
              <FileSignature className="mr-2 h-4 w-4" />
              Ver Solicitações
            </Button>
          </div>
        </Card>
        
        {contractId && showViewRequestsModal && (
          <ViewSignatureRequests 
            contractId={contractId}
            open={showViewRequestsModal}
            onClose={() => setShowViewRequestsModal(false)}
          />
        )}
      </>
    );
  }

  // Show default state for requesting signatures
  return (
    <>
      <Card className="bg-primary-50 border-primary-200 p-4 animate-fade-in">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-primary-800">Solicitar aprovação online</h3>
            <p className="text-sm text-primary-600">
              Envie esta proposta para assinatura digital pelo cliente através de um link seguro.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={agreed} onCheckedChange={() => setAgreed(!agreed)} />
              <label
                htmlFor="terms"
                className="text-sm leading-none text-gray-600 font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Confirmo que esta proposta está pronta para ser enviada
              </label>
            </div>
            
            <Button onClick={handleSendApproval} disabled={loading || !agreed} className="w-full md:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar para assinatura
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
      
      {contractId && showRequestModal && (
        <RequestSignatureModal
          open={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          contractId={contractId}
          onSuccess={() => setHasSignatureRequests(true)}
        />
      )}
    </>
  );
}
