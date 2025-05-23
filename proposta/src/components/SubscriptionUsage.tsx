
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getPlan } from "@/config/plans";
import { AlertCircle, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SubscriptionUsage() {
  const { plan, usedProposals, proposalsRemaining, canCreateNewProposal } = useSubscription();
  const currentPlan = getPlan(plan);
  
  // Don't show progress for unlimited plans
  const isUnlimited = currentPlan.proposalsLimit === Infinity;
  
  // Calculate percentage for progress bar
  const percentage = isUnlimited ? 0 : (usedProposals / currentPlan.proposalsLimit) * 100;

  // Determine color based on usage
  const getProgressColor = () => {
    if (isUnlimited) return "bg-green-500";
    if (percentage > 80) return "bg-amber-500";
    return "bg-primary";
  };

  // Determine icon based on plan
  const getPlanIcon = () => {
    if (plan === 'professional') return <Zap className="h-5 w-5 text-primary-500" />;
    if (plan === 'intermediate') return <TrendingUp className="h-5 w-5 text-blue-500" />;
    return null;
  };

  return (
    <Card className="border-primary/20 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary-50 to-white p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {getPlanIcon()}
                <h3 className="text-lg font-medium">
                  Plano <span className="font-bold">{currentPlan.name}</span>
                </h3>
              </div>
              <p className="text-gray-600 mt-1">
                {isUnlimited 
                  ? "Propostas ilimitadas" 
                  : `${usedProposals} de ${currentPlan.proposalsLimit} propostas usadas este mês`}
              </p>
            </div>
            
            <Link to="/planos">
              <Button variant={plan === 'professional' ? "outline" : "default"}>
                {plan === 'professional' ? 'Gerenciar assinatura' : 'Fazer upgrade'}
              </Button>
            </Link>
          </div>
          
          {!isUnlimited && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{proposalsRemaining} propostas restantes</span>
                <span className={percentage > 80 ? "text-amber-600 font-medium" : "text-gray-600"}>
                  {Math.round(percentage)}%
                </span>
              </div>
              <Progress 
                value={percentage} 
                className={`h-2 ${getProgressColor()}`} 
              />
            </div>
          )}
          
          {!canCreateNewProposal && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-3 animate-pulse">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Limite de propostas atingido
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Você atingiu o limite de propostas para este mês.{' '}
                  <Link to="/planos" className="underline font-medium">
                    Considere fazer um upgrade
                  </Link>{' '}
                  para criar mais propostas.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
