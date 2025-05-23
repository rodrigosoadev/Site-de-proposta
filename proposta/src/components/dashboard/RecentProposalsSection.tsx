
import { Link } from "react-router-dom";
import { useProposals } from "@/contexts/ProposalContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ChevronRight, PlusCircle } from "lucide-react";

export function RecentProposalsSection() {
  const { filteredProposals } = useProposals();
  const recentProposals = filteredProposals.slice(0, 5);
  
  const getStatusBadge = (date: string) => {
    const proposalDate = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - proposalDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      return <Badge className="bg-green-500">Nova</Badge>;
    } else if (diffDays < 7) {
      return <Badge className="bg-blue-500">Recente</Badge>;
    } else {
      return <Badge variant="outline">Anterior</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Propostas Recentes</h2>
        <Link to="/propostas" className="text-primary hover:underline text-sm flex items-center">
          Ver todas 
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      {recentProposals.length > 0 ? (
        <div className="space-y-3">
          {recentProposals.map((proposal) => (
            <div 
              key={proposal.id} 
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="hidden sm:flex h-10 w-10 rounded bg-gray-100 items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{proposal.clientName}</h3>
                      {getStatusBadge(proposal.createdAt)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(proposal.total)}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/propostas/${proposal.id}`}>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="py-8 text-center">
        <div className="flex flex-col items-center">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">Nenhuma proposta criada</p>
          <p className="text-gray-500 mb-4">Comece criando sua primeira proposta comercial</p>
          <Link to="/propostas/nova">
            <Button>
              <PlusCircle className="h-5 w-5 mr-2" />
              Criar Proposta
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
