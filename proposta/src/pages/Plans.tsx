
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { plans, PlanType, Plan } from "@/config/plans";
import { Check, X } from "lucide-react";

function PlanCard({ 
  plan, 
  currentPlan, 
  onSelect 
}: { 
  plan: Plan; 
  currentPlan: PlanType;
  onSelect: (planId: PlanType) => void;
}) {
  const isCurrentPlan = currentPlan === plan.id;

  return (
    <div 
      className={`flex flex-col rounded-lg overflow-hidden border ${plan.recommended ? 'border-primary ring-2 ring-primary' : 'border-gray-200'} ${isCurrentPlan ? 'bg-gray-50' : 'bg-white'}`}
    >
      {plan.recommended && (
        <div className="bg-primary text-white text-center py-1 text-sm font-medium">
          Mais popular
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <div className="mt-4">
          <span className="text-3xl font-bold">
            {plan.price === 0 ? "Grátis" : `R$${plan.price.toFixed(2)}`}
          </span>
          {plan.price > 0 && <span className="text-gray-500">/mês</span>}
        </div>

        <div className="mt-6">
          <div className="font-medium mb-2">Inclui:</div>
          <ul className="space-y-3">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                {feature.included ? (
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-gray-300 mr-2 shrink-0" />
                )}
                <div>
                  <span className={feature.highlight ? "font-medium" : ""}>
                    {feature.name}
                  </span>
                  {feature.description && (
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          {isCurrentPlan ? (
            <Button disabled className="w-full">Plano atual</Button>
          ) : (
            <Button 
              variant={plan.id === "free" ? "outline" : "default"}
              className="w-full"
              onClick={() => onSelect(plan.id)}
            >
              {currentPlan === "free" && plan.id !== "free" 
                ? "Fazer upgrade" 
                : plan.id === "free" 
                  ? "Fazer downgrade" 
                  : "Mudar plano"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureComparisonTable() {
  return (
    <div className="mt-12 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-4 px-6 text-left">Funcionalidade</th>
            {plans.map(plan => (
              <th key={plan.id} className="py-4 px-6 text-center">{plan.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-4 px-6 font-medium">Propostas por mês</td>
            {plans.map(plan => (
              <td key={plan.id} className="py-4 px-6 text-center">
                {plan.proposalsLimit === Infinity ? "Ilimitado" : plan.proposalsLimit}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6 font-medium">Personalização visual</td>
            {plans.map(plan => (
              <td key={plan.id} className="py-4 px-6 text-center">
                {plan.id === 'free' && <X className="inline h-5 w-5 text-red-500" />}
                {plan.id === 'intermediate' && <span>Básica</span>}
                {plan.id === 'professional' && <span>Completa</span>}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6 font-medium">Logo da empresa</td>
            {plans.map(plan => (
              <td key={plan.id} className="py-4 px-6 text-center">
                {plan.id === 'free' ? (
                  <X className="inline h-5 w-5 text-red-500" />
                ) : (
                  <Check className="inline h-5 w-5 text-green-500" />
                )}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6 font-medium">Histórico</td>
            {plans.map(plan => (
              <td key={plan.id} className="py-4 px-6 text-center">
                {plan.id === 'free' ? "3 últimos" : "Completo"}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6 font-medium">Marca d'água</td>
            {plans.map(plan => (
              <td key={plan.id} className="py-4 px-6 text-center">
                {plan.id === 'free' ? "Sim" : "Não"}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6 font-medium">Templates</td>
            {plans.map(plan => (
              <td key={plan.id} className="py-4 px-6 text-center">
                {plan.id === 'free' && "Básico"}
                {plan.id === 'intermediate' && "2 temas"}
                {plan.id === 'professional' && "Premium (3)"}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6 font-medium">Link de aprovação</td>
            {plans.map(plan => (
              <td key={plan.id} className="py-4 px-6 text-center">
                {plan.id === 'professional' ? (
                  <Check className="inline h-5 w-5 text-green-500" />
                ) : (
                  <X className="inline h-5 w-5 text-red-500" />
                )}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="py-4 px-6 font-medium">Assinatura eletrônica</td>
            {plans.map(plan => (
              <td key={plan.id} className="py-4 px-6 text-center">
                {plan.id === 'professional' ? (
                  <Check className="inline h-5 w-5 text-green-500" />
                ) : (
                  <X className="inline h-5 w-5 text-red-500" />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-4 px-6 font-medium">Suporte</td>
            {plans.map(plan => (
              <td key={plan.id} className="py-4 px-6 text-center">
                {plan.id === 'free' && <X className="inline h-5 w-5 text-red-500" />}
                {plan.id === 'intermediate' && "Email (48h)"}
                {plan.id === 'professional' && "Prioritário (24h)"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function Plans() {
  const { toast } = useToast();
  const { plan: currentPlan, updatePlan } = useSubscription();
  const [isLoading, setIsLoading] = useState<PlanType | null>(null);

  const handlePlanSelection = async (planId: PlanType) => {
    setIsLoading(planId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, we would process payment through Stripe here
    if (planId !== 'free') {
      toast({
        title: "Implementação do Stripe",
        description: "Em uma implementação real, aqui seria integrado o Stripe para processamento de pagamento.",
      });
    }
    
    updatePlan(planId);
    setIsLoading(null);
  };

  return (
    <Layout title="Planos de Assinatura">
      <div className="space-y-6">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Escolha o plano ideal para você</h2>
          <p className="text-gray-600">
            De freelancers a agências, temos um plano que atende às suas necessidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlan={currentPlan}
              onSelect={handlePlanSelection}
            />
          ))}
        </div>
        
        <FeatureComparisonTable />
      </div>
    </Layout>
  );
}
