
import { useProposals } from "@/contexts/ProposalContext";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

export function ActivityFeed() {
  const { filteredProposals } = useProposals();
  
  if (filteredProposals.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Atividade recente</CardTitle>
        <CardDescription>Nos últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredProposals.slice(0, 2).map((proposal) => (
            <div key={proposal.id} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <p className="text-sm">
                Proposta para <span className="font-medium">{proposal.clientName}</span> criada
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
