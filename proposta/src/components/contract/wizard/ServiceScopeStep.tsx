
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ServiceType, contractTemplates, serviceTypes } from "@/config/contractTemplates";
import { useToast } from "@/hooks/use-toast";
import { DynamicQuestions } from "./DynamicQuestions";
import { useState } from "react";

interface ServiceScopeStepProps {
  value: string;
  serviceType: ServiceType | null;
  onChange: (value: string) => void;
  questionResponses?: Record<string, any>;
  onQuestionResponseChange?: (questionId: string, value: any) => void;
}

export function ServiceScopeStep({ 
  value, 
  serviceType, 
  onChange, 
  questionResponses = {}, 
  onQuestionResponseChange = () => {} 
}: ServiceScopeStepProps) {
  const { toast } = useToast();
  const [showDynamicQuestions, setShowDynamicQuestions] = useState(false);
  
  // Get template suggestion based on service type
  const getScopeSuggestion = () => {
    if (!serviceType) return '';
    return contractTemplates[serviceType].clauses.scope || '';
  };

  // Check if this service type has dynamic questions
  const hasDynamicQuestions = () => {
    if (!serviceType) return false;
    const config = serviceTypes.find(s => s.id === serviceType);
    return config?.questions && config.questions.length > 0;
  };

  const handleToggleQuestions = () => {
    setShowDynamicQuestions(!showDynamicQuestions);
    if (!showDynamicQuestions) {
      toast({ 
        title: "Questionário dinâmico ativado", 
        description: "Responda às perguntas para gerar um contrato mais detalhado e específico." 
      });
    } else {
      toast({
        title: "Editor de texto ativado",
        description: "Você voltou ao modo de edição de texto livre."
      });
    }
  };

  // Debug log to check if hasDynamicQuestions is working
  console.log("Service type:", serviceType);
  console.log("Has dynamic questions:", hasDynamicQuestions());
  console.log("Show dynamic questions:", showDynamicQuestions);
  console.log("Service types config:", serviceTypes);

  return (
    <div className="space-y-6">
      {serviceType && hasDynamicQuestions() && (
        <div className="bg-muted p-4 rounded-md mb-6">
          <h4 className="font-medium mb-2">Perguntas específicas disponíveis</h4>
          <p className="text-sm mb-4">Este tipo de serviço possui um questionário detalhado específico que ajudará a criar um contrato mais completo.</p>
          <button
            type="button"
            onClick={handleToggleQuestions}
            className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded"
          >
            {showDynamicQuestions ? "Voltar ao editor de texto" : "Usar questionário específico"}
          </button>
        </div>
      )}

      {showDynamicQuestions && serviceType && hasDynamicQuestions() ? (
        <DynamicQuestions 
          serviceType={serviceType}
          responses={questionResponses}
          onResponseChange={onQuestionResponseChange}
        />
      ) : (
        <div>
          <Label htmlFor="service-scope" className="text-base">
            Descreva detalhadamente o serviço que será prestado
          </Label>
          <p className="text-sm text-muted-foreground mb-4">
            Seja específico sobre o que será feito, entregues, e quaisquer condições especiais.
          </p>
          <Textarea
            id="service-scope"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Descreva os serviços a serem prestados..."
            className="min-h-[200px]"
          />
        </div>
      )}

      {serviceType && !showDynamicQuestions && (
        <div className="bg-muted p-4 rounded-md">
          <h4 className="font-medium mb-2">Sugestão com base no tipo de serviço</h4>
          <p className="text-sm">{getScopeSuggestion()}</p>
          {getScopeSuggestion() && (
            <button
              type="button"
              className="text-sm text-primary mt-2 underline"
              onClick={() => onChange(getScopeSuggestion())}
            >
              Usar esta sugestão
            </button>
          )}
        </div>
      )}
    </div>
  );
}
