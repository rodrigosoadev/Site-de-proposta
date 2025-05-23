
import { Link } from "react-router-dom";
import { useProposals } from "@/contexts/ProposalContext";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function GettingStartedSection() {
  const { filteredProposals } = useProposals();
  
  // Only show for users with 0 or few proposals
  if (filteredProposals.length > 3) {
    return null;
  }
  
  return (
    <Card className="border-primary-200 bg-primary-50/50">
      <CardHeader>
        <CardTitle>Comece Aqui</CardTitle>
        <CardDescription>Siga estes passos para criar suas propostas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 rounded-full bg-primary/20 items-center justify-center text-primary font-medium">
              1
            </div>
            <div>
              <h3 className="font-medium">Crie uma proposta</h3>
              <p className="text-sm text-gray-500">
                Adicione itens, valores e detalhes do seu cliente
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex h-8 w-8 rounded-full bg-primary/20 items-center justify-center text-primary font-medium">
              2
            </div>
            <div>
              <h3 className="font-medium">Baixe o PDF</h3>
              <p className="text-sm text-gray-500">
                Gere um PDF profissional com todos os detalhes da proposta
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex h-8 w-8 rounded-full bg-primary/20 items-center justify-center text-primary font-medium">
              3
            </div>
            <div>
              <h3 className="font-medium">Envie para seu cliente</h3>
              <p className="text-sm text-gray-500">
                Compartilhe a proposta via e-mail ou link de aprovação
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/propostas/nova" className="w-full">
          <Button className="w-full">
            <PlusCircle className="h-5 w-5 mr-2" />
            Criar Minha Primeira Proposta
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
