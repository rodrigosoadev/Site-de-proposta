
import { Link } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, ArrowRight } from "lucide-react";

export function PlanStatusCard() {
  const { plan, usedProposals, proposalsRemaining } = useSubscription();
  
  const getPlanName = () => {
    switch(plan) {
      case 'professional': return "Profissional";
      case 'intermediate': return "Intermediário";
      default: return "Gratuito";
    }
  };
  
  const getMaxProposals = () => {
    switch(plan) {
      case 'professional': return "Ilimitado";
      case 'intermediate': return "10";
      default: return "2";
    }
  };
  
  const getProgressValue = () => {
    if (plan === 'professional') return 100;
    return (usedProposals / (plan === 'intermediate' ? 10 : 2)) * 100;
  };
  
  const getNextResetDate = () => {
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);
    nextMonth.setDate(1);
    return nextMonth.toLocaleDateString('pt-BR');
  };
  
  const getCardStyle = () => {
    switch(plan) {
      case 'professional':
        return "border-purple-200 bg-gradient-to-br from-purple-50 to-white";
      case 'intermediate':
        return "border-blue-200 bg-gradient-to-br from-blue-50 to-white";
      default:
        return "border-gray-200";
    }
  };

  return (
    <Card className={`${getCardStyle()}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Seu plano: <span className="font-bold">{getPlanName()}</span></CardTitle>
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
        <CardDescription>Status de uso mensal</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Propostas utilizadas</span>
              <span className="font-medium">
                {plan === 'professional' ? (
                  `${usedProposals} / ∞`
                ) : (
                  `${usedProposals} / ${getMaxProposals()}`
                )}
              </span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
          </div>
          
          <div className="text-xs text-gray-500 flex justify-between">
            <span>Próxima renovação: {getNextResetDate()}</span>
            {proposalsRemaining < Infinity && (
              <span>{proposalsRemaining} propostas restantes</span>
            )}
          </div>
        </div>
      </CardContent>
      {plan !== 'professional' && (
        <CardFooter className="pt-0">
          <Link to="/planos" className="w-full">
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary-50">
              <ArrowRight className="h-4 w-4 mr-2" />
              Fazer upgrade de plano
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
