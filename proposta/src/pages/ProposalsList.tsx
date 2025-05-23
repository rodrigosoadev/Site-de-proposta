import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProposalProvider, useProposals } from "@/contexts/ProposalContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { PlusCircle, FileText, Search, Calendar, FileSignature } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SignatureStatusBadge from "@/components/signature/SignatureStatusBadge";

function ProposalsListContent() {
  const { proposals } = useProposals();
  const { plan } = useSubscription();
  const [searchTerm, setSearchTerm] = useState("");
  const [signatureStatuses, setSignatureStatuses] = useState<Record<string, string>>({});

  const filteredProposals = proposals.filter(proposal => 
    proposal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proposal.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch signature statuses for all proposals
  useEffect(() => {
    const fetchSignatureStatuses = async () => {
      if (plan !== 'professional' || proposals.length === 0) return;
      
      try {
        // Get all contracts for these proposals
        const { data: contracts, error: contractsError } = await supabase
          .from('contracts')
          .select('id, proposal_id')
          .in('proposal_id', proposals.map(p => p.id));
          
        if (contractsError) throw contractsError;
        
        if (!contracts.length) return;
        
        // Get signature requests for these contracts
        const { data: requests, error: requestsError } = await supabase
          .from('signature_requests')
          .select('contract_id, status')
          .in('contract_id', contracts.map(c => c.id));
          
        if (requestsError) throw requestsError;
        
        // Create a mapping of proposal_id to signature status
        const statusMap: Record<string, string> = {};
        
        for (const contract of contracts) {
          const contractRequests = requests.filter(r => r.contract_id === contract.id);
          
          if (contractRequests.length > 0) {
            // If any request is completed, mark as completed
            if (contractRequests.some(r => r.status === 'completed')) {
              statusMap[contract.proposal_id] = 'completed';
            }
            // If any request is pending, mark as pending
            else if (contractRequests.some(r => r.status === 'pending')) {
              statusMap[contract.proposal_id] = 'pending';
            }
            // Otherwise use the status of the first request
            else {
              statusMap[contract.proposal_id] = contractRequests[0].status;
            }
          }
        }
        
        setSignatureStatuses(statusMap);
      } catch (error) {
        console.error("Error fetching signature statuses:", error);
      }
    };
    
    fetchSignatureStatuses();
  }, [proposals, plan]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Buscar propostas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/propostas/nova">
          <Button>
            <PlusCircle className="h-5 w-5 mr-2" />
            Nova Proposta
          </Button>
        </Link>
      </div>
      
      {filteredProposals.length > 0 ? (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <Card key={proposal.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="p-4 md:p-6">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg">{proposal.clientName}</h3>
                    {plan === 'professional' && signatureStatuses[proposal.id] && (
                      <div className="flex items-center">
                        <FileSignature className="h-4 w-4 text-primary-600 mr-1" />
                        <SignatureStatusBadge status={signatureStatuses[proposal.id] as any} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  <p className="text-sm mt-2 text-gray-600 line-clamp-2">
                    {proposal.description || "Sem descrição"}
                  </p>
                </div>
                <div className="border-t md:border-t-0 md:border-l border-gray-100 flex flex-row md:flex-col justify-between md:justify-center items-center gap-4 p-4 md:p-6 bg-gray-50 md:min-w-[200px]">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Valor total</div>
                    <div className="font-semibold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(proposal.total)}
                    </div>
                  </div>
                  <Link to={`/propostas/${proposal.id}`}>
                    <Button variant="outline" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver proposta
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            {searchTerm ? (
              <>
                <p className="text-lg font-medium mb-2">Nenhuma proposta encontrada</p>
                <p className="text-gray-500 mb-4">
                  Não encontramos nenhuma proposta com o termo "{searchTerm}"
                </p>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Limpar busca
                </Button>
              </>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">Nenhuma proposta criada</p>
                <p className="text-gray-500 mb-4">Comece criando sua primeira proposta comercial</p>
                <Link to="/propostas/nova">
                  <Button>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Criar Proposta
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

export default function ProposalsList() {
  return (
    <Layout title="Minhas Propostas">
      <ProposalsListContent />
    </Layout>
  );
}
