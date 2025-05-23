
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ServiceTypeStep } from "./wizard/ServiceTypeStep";
import { ContractorInfoStep } from "./wizard/ContractorInfoStep";
import { ContractedInfoStep } from "./wizard/ContractedInfoStep";
import { ServiceScopeStep } from "./wizard/ServiceScopeStep";
import { PaymentInfoStep } from "./wizard/PaymentInfoStep";
import { TimelineStep } from "./wizard/TimelineStep";
import { ClausesStep } from "./wizard/ClausesStep";
import { JurisdictionStep } from "./wizard/JurisdictionStep";
import { ServiceType } from "@/config/contractTemplates";
import { useToast } from "@/hooks/use-toast";

export interface ContractFormData {
  serviceType: ServiceType | null;
  serviceTypeCustomName?: string;
  contractor: {
    name: string;
    document: string;
    address: string;
    email: string;
    phone: string;
    isCompany: boolean;
    legalRepresentative?: string;
  };
  contracted: {
    name: string;
    document: string;
    address: string;
    email: string;
    phone: string;
    isCompany: boolean;
    legalRepresentative?: string;
  };
  serviceScope: string;
  payment: {
    amount: number;
    method: string;
    installments: number;
    conditions: string;
    lateFees?: string;
  };
  timeline: {
    startDate: string;
    endDate: string;
    milestones?: { date: string; description: string }[];
  };
  clauses: {
    confidentiality: boolean;
    personalData: boolean;
    intellectualProperty: boolean;
    insurance: boolean;
  };
  jurisdiction: string;
  questionResponses?: Record<string, any>;
}

export type WizardStep = 
  | 'service-type'
  | 'contractor-info'
  | 'contracted-info'
  | 'service-scope'
  | 'payment'
  | 'timeline'
  | 'clauses'
  | 'jurisdiction';

const wizardSteps: WizardStep[] = [
  'service-type',
  'contractor-info',
  'contracted-info',
  'service-scope',
  'payment',
  'timeline',
  'clauses',
  'jurisdiction'
];

interface ContractWizardProps {
  onComplete: (data: ContractFormData) => void;
}

export default function ContractWizard({ onComplete }: ContractWizardProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<ContractFormData>({
    serviceType: null,
    contractor: {
      name: '',
      document: '',
      address: '',
      email: '',
      phone: '',
      isCompany: false
    },
    contracted: {
      name: '',
      document: '',
      address: '',
      email: '',
      phone: '',
      isCompany: false
    },
    serviceScope: '',
    payment: {
      amount: 0,
      method: 'pix',
      installments: 1,
      conditions: ''
    },
    timeline: {
      startDate: '',
      endDate: '',
    },
    clauses: {
      confidentiality: false,
      personalData: false,
      intellectualProperty: false,
      insurance: false
    },
    jurisdiction: '',
    questionResponses: {}
  });

  const updateFormData = (field: keyof ContractFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionResponseChange = (questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      questionResponses: {
        ...(prev.questionResponses || {}),
        [questionId]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      toast({
        title: `Etapa ${currentStep + 1} concluída`,
        description: `Avançando para ${getStepTitle(wizardSteps[currentStep + 1])}`
      });
    } else {
      toast({
        title: "Contrato finalizado",
        description: "Seu contrato foi criado com sucesso!"
      });
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = (step: WizardStep): string => {
    switch (step) {
      case 'service-type': 
        return 'Tipo de Serviço';
      case 'contractor-info': 
        return 'Informações do Contratante';
      case 'contracted-info': 
        return 'Informações do Contratado';
      case 'service-scope': 
        return 'Escopo do Serviço';
      case 'payment': 
        return 'Pagamento';
      case 'timeline': 
        return 'Prazos e Entregas';
      case 'clauses': 
        return 'Cláusulas Adicionais';
      case 'jurisdiction': 
        return 'Rescisão e Foro';
      default: 
        return 'Contrato';
    }
  };

  const renderStepContent = () => {
    switch (wizardSteps[currentStep]) {
      case 'service-type':
        return <ServiceTypeStep 
          value={formData.serviceType}
          customName={formData.serviceTypeCustomName}
          onChange={(type, customName) => {
            updateFormData('serviceType', type);
            if (customName) {
              updateFormData('serviceTypeCustomName', customName);
            }
          }}
        />;
      case 'contractor-info':
        return <ContractorInfoStep 
          value={formData.contractor}
          onChange={(data) => updateFormData('contractor', data)}
        />;
      case 'contracted-info':
        return <ContractedInfoStep 
          value={formData.contracted}
          onChange={(data) => updateFormData('contracted', data)}
        />;
      case 'service-scope':
        return <ServiceScopeStep 
          value={formData.serviceScope}
          serviceType={formData.serviceType}
          onChange={(data) => updateFormData('serviceScope', data)}
          questionResponses={formData.questionResponses}
          onQuestionResponseChange={handleQuestionResponseChange}
        />;
      case 'payment':
        return <PaymentInfoStep 
          value={formData.payment}
          onChange={(data) => updateFormData('payment', data)}
        />;
      case 'timeline':
        return <TimelineStep 
          value={formData.timeline}
          onChange={(data) => updateFormData('timeline', data)}
        />;
      case 'clauses':
        return <ClausesStep 
          value={formData.clauses}
          onChange={(data) => updateFormData('clauses', data)}
        />;
      case 'jurisdiction':
        return <JurisdictionStep 
          value={formData.jurisdiction}
          onChange={(data) => updateFormData('jurisdiction', data)}
        />;
      default:
        return null;
    }
  };

  const canContinue = () => {
    switch (wizardSteps[currentStep]) {
      case 'service-type':
        return formData.serviceType !== null;
      case 'contractor-info':
        return !!formData.contractor.name && !!formData.contractor.document;
      case 'contracted-info':
        return !!formData.contracted.name && !!formData.contracted.document;
      case 'service-scope':
        return !!formData.serviceScope;
      case 'payment':
        return formData.payment.amount > 0;
      case 'timeline':
        return !!formData.timeline.startDate && !!formData.timeline.endDate;
      case 'jurisdiction':
        return !!formData.jurisdiction;
      default:
        return true;
    }
  };

  const stepProgress = ((currentStep + 1) / wizardSteps.length) * 100;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{getStepTitle(wizardSteps[currentStep])}</h2>
        <div className="w-full bg-gray-200 h-2 mt-4 rounded-full">
          <div 
            className="bg-primary h-2 rounded-full transition-all" 
            style={{ width: `${stepProgress}%` }}
          ></div>
        </div>
        <div className="text-xs text-muted-foreground mt-1 text-right">
          Etapa {currentStep + 1} de {wizardSteps.length}
        </div>
      </div>

      <div className="min-h-[400px]">
        {renderStepContent()}
      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canContinue()}
        >
          {currentStep === wizardSteps.length - 1 ? 'Finalizar' : 'Próximo'}
          {currentStep !== wizardSteps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </Card>
  );
}
