
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Send, CheckSquare, ArrowRight } from "lucide-react";

export default function GettingStartedGuide() {
  const steps = [
    {
      id: 1,
      title: "Crie uma proposta",
      description: "Preencha os dados da proposta, adicione seus itens e personalize conforme necessário.",
      icon: <FileText className="h-8 w-8 text-primary" />
    },
    {
      id: 2,
      title: "Envie para assinatura",
      description: "Solicite a aprovação digital do seu cliente com apenas alguns cliques.",
      icon: <Send className="h-8 w-8 text-primary" />
    },
    {
      id: 3,
      title: "Acompanhe o status",
      description: "Monitore quando suas propostas foram visualizadas e assinadas pelos clientes.",
      icon: <CheckSquare className="h-8 w-8 text-primary" />
    }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Como usar o PropostaPro</CardTitle>
        <CardDescription>
          Siga este guia rápido para começar a usar o sistema de propostas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex-shrink-0 flex items-start pt-1">
                {step.icon}
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
          
          <div className="pt-2">
            <a 
              href="/dashboard" 
              className="inline-flex items-center text-primary font-medium hover:underline"
            >
              Ir para o Dashboard
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
