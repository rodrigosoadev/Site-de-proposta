
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import ContractWizard from "@/components/contract/ContractWizard";
import ContractPreview from "@/components/contract/ContractPreview";

export default function CreateContract() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canCreateNewProposal } = useSubscription();
  const [previewMode, setPreviewMode] = useState(false);
  const [contractData, setContractData] = useState<any>(null);
  
  // Check if user can create a new contract based on their subscription
  if (!canCreateNewProposal) {
    toast({
      title: "Limite do plano atingido",
      description: "Você está utilizando o plano gratuito, que permite criar apenas uma proposta. Para criar mais, faça o upgrade para um plano premium.",
      variant: "destructive",
      action: (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/planos')}
        >
          Ver planos
        </Button>
      ),
    });
    
    // Redirect after showing toast
    setTimeout(() => navigate('/propostas'), 1000);
    
    return null;
  }

  const handleContractComplete = (data: any) => {
    setContractData(data);
    setPreviewMode(true);
  };

  const handleBack = () => {
    setPreviewMode(false);
  };

  const handleSave = async () => {
    try {
      toast({
        title: "Contrato salvo",
        description: "Seu contrato foi salvo com sucesso",
      });
      navigate("/propostas");
    } catch (error) {
      toast({
        title: "Erro ao salvar contrato",
        description: "Ocorreu um erro ao salvar seu contrato. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout title="Novo Contrato">
      <div className="max-w-4xl mx-auto">
        {previewMode ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleBack}>
                Voltar e editar
              </Button>
              <Button onClick={handleSave}>
                Salvar contrato
              </Button>
            </div>
            <ContractPreview data={contractData} />
          </div>
        ) : (
          <ContractWizard onComplete={handleContractComplete} />
        )}
      </div>
    </Layout>
  );
}
