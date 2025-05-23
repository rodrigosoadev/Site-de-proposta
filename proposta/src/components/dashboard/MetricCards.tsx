
import { useProposals } from "@/contexts/ProposalContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, BarChart3, Clock } from "lucide-react";

export function MetricCards() {
  const { filteredProposals, proposals } = useProposals();
  
  // Get proposals from the last 30 days
  const lastMonthProposals = proposals.filter(p => {
    const date = new Date(p.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return date >= thirtyDaysAgo;
  });
  
  // Total value of all proposals
  const totalValue = filteredProposals.reduce((acc, proposal) => acc + proposal.total, 0);
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Total de Propostas</CardTitle>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <CardDescription>Total de propostas criadas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{filteredProposals.length}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Valor Total</CardTitle>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <CardDescription>Soma de todas as propostas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(totalValue)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Último mês</CardTitle>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <CardDescription>Propostas nos últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {lastMonthProposals.length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
