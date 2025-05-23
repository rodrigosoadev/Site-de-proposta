
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Settings, HelpCircle } from "lucide-react";

export function DashboardHeader() {
  const { user } = useAuth();
  const { plan } = useSubscription();
  
  const getPlanBadge = () => {
    switch(plan) {
      case 'professional':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Plano Profissional</Badge>;
      case 'intermediate':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Plano Intermediário</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Plano Gratuito</Badge>;
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">Bem-vindo, {user?.name || 'Usuário'}!</h2>
            {getPlanBadge()}
          </div>
          <p className="text-gray-500 mt-1">
            Gerencie suas propostas e aumente suas vendas
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/propostas/nova">
            <Button>
              <PlusCircle className="h-5 w-5 mr-2" />
              Nova Proposta
            </Button>
          </Link>
          <Button variant="outline" className="hidden md:flex">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button variant="ghost" className="hidden md:flex">
            <HelpCircle className="h-4 w-4 mr-2" />
            Ajuda
          </Button>
        </div>
      </div>
    </div>
  );
}
