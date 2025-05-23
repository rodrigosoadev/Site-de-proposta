
import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useProposals, Proposal } from "@/contexts/ProposalContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  Download, 
  ChevronLeft, 
  FileText, 
  Share2, 
  Copy, 
  CheckCircle2,
  ArrowRight,
  Loader2
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import ProposalApprovalBanner from "@/components/ProposalApprovalBanner";
import { supabase } from '@/integrations/supabase/client';

function ViewProposalContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getProposal } = useProposals();
  const { user } = useAuth();
  const { plan, showUpgradeModal } = useSubscription();
  const proposalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [showContract, setShowContract] = useState(true);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [contractContent, setContractContent] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      const foundProposal = getProposal(id);
      setProposal(foundProposal);
      
      if (foundProposal) {
        loadContract(foundProposal.id);
      }
    }
  }, [id, getProposal]);
  
  const loadContract = async (proposalId: string) => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('content')
        .eq('proposal_id', proposalId)
        .single();
        
      if (error) {
        console.error('Error loading contract:', error);
        return;
      }
      
      if (data) {
        setContractContent(data.content);
      }
    } catch (error) {
      console.error('Error loading contract:', error);
    }
  };
  
  if (!id) {
    navigate('/propostas');
    return null;
  }
  
  if (!proposal) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Proposta não encontrada</h2>
        <p className="text-gray-500 mb-6">
          A proposta que você está procurando não existe ou foi removida.
        </p>
        <Link to="/propostas">
          <Button>Ver todas as propostas</Button>
        </Link>
      </div>
    );
  }

  // Function to handle PDF generation and download
  const handlePrint = () => {
    setLoadingPdf(true);
    
    // Simulate PDF generation delay
    setTimeout(() => {
      window.print();
      setLoadingPdf(false);
      toast({
        title: "Proposta salva",
        description: "Sua proposta foi salva como PDF.",
      });
    }, 1000);
  };
  
  // Function to handle sharing for premium users
  const handleShare = () => {
    if (plan === 'professional') {
      // Generate a shareable link (in a real app, this would create a unique URL)
      const shareableUrl = `${window.location.origin}/share/${id}`;
      
      navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      
      toast({
        title: "Link copiado!",
        description: "Link de aprovação copiado para a área de transferência.",
      });
      
      setTimeout(() => setCopied(false), 3000);
    } else {
      // Show upgrade modal for non-premium users
      showUpgradeModal();
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Define template based on plan
  const getTemplateClass = () => {
    switch (plan) {
      case 'professional':
        return 'proposal-template-premium';
      case 'intermediate':
        return 'proposal-template-standard';
      default:
        return 'proposal-template-basic';
    }
  };
  
  // Function to toggle contract visibility
  const toggleContract = () => {
    setShowContract(!showContract);
  };
  
  // Current date for the contract
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  return (
    <div className="space-y-6 print:p-0 print:space-y-0">
      <div className="flex items-center justify-between print:hidden">
        <Button 
          variant="ghost" 
          className="flex items-center text-gray-600" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={plan === 'professional' ? "default" : "outline"}
                  onClick={handleShare}
                  className={plan === 'professional' ? "bg-primary-600 hover:bg-primary-700" : ""}
                >
                  {copied ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
                  {copied ? "Copiado!" : "Compartilhar"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {plan === 'professional' 
                  ? "Compartilhe um link para aprovação pelo cliente" 
                  : "Disponível no plano Profissional"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button 
            onClick={handlePrint} 
            className="print:hidden" 
            disabled={loadingPdf}
          >
            {loadingPdf ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>
      
      {plan === 'professional' && (
        <ProposalApprovalBanner proposal={proposal} />
      )}
      
      <div className={`proposal-page bg-white relative rounded-lg shadow-lg overflow-hidden ${getTemplateClass()}`} ref={proposalRef}>
        {/* Free plan watermark */}
        {plan === 'free' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <div className="transform rotate-45 text-gray-200 text-5xl font-bold opacity-10 select-none">
              PropostaPro
            </div>
          </div>
        )}
        
        <div className="p-8 md:p-10 print:p-8">
          <div className="mb-12">
            {user?.companyLogo && plan !== 'free' && (
              <div className="mb-8 flex justify-center md:justify-start">
                <img 
                  src={user.companyLogo} 
                  alt="Logo da empresa" 
                  className="max-h-24 object-contain" 
                />
              </div>
            )}
            
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Proposto para:</p>
                <h2 className="text-2xl font-bold text-gray-800">{proposal.clientName}</h2>
              </div>
              
              <div className="text-right space-y-2">
                <h1 className={`text-2xl font-bold ${plan === 'free' ? 'text-gray-800' : 'text-primary-700'}`}>
                  PROPOSTA COMERCIAL
                </h1>
                <p className="text-gray-500">
                  Data de emissão: {formatDate(proposal.createdAt)}
                </p>
                <p className="text-gray-500">
                  Nº {proposal.id.split('-')[1].substring(0, 6)}
                </p>
              </div>
            </div>
          </div>
          
          {proposal.description && (
            <div className="mb-10">
              <h2 className={`text-xl font-semibold border-b pb-3 mb-6 ${plan === 'free' ? 'border-gray-200' : 'border-primary-200'}`}>
                Descrição dos serviços
              </h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{proposal.description}</p>
              </div>
            </div>
          )}
          
          <div className="mb-10">
            <h2 className={`text-xl font-semibold border-b pb-3 mb-6 ${plan === 'free' ? 'border-gray-200' : 'border-primary-200'}`}>
              Escopo e investimento
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`${plan === 'free' ? 'bg-gray-50' : 'bg-primary-50'}`}>
                    <th className="text-left p-4 font-semibold">Descrição</th>
                    <th className="text-right p-4 font-semibold">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {proposal.items.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="p-4">{item.name}</td>
                      <td className="text-right p-4">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(item.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={`font-bold ${plan === 'free' ? 'bg-gray-100' : 'bg-primary-100'}`}>
                    <td className="p-4">VALOR TOTAL</td>
                    <td className="text-right p-4">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(proposal.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`border rounded-md p-5 ${plan === 'free' ? '' : 'border-primary-200'}`}>
              <h3 className="font-semibold mb-2">Prazo de entrega</h3>
              <p className="text-lg">{formatDate(proposal.deliveryDate)}</p>
            </div>
            <div className={`border rounded-md p-5 ${plan === 'free' ? '' : 'border-primary-200'}`}>
              <h3 className="font-semibold mb-2">Validade da proposta</h3>
              <p className="text-lg">{formatDate(proposal.validUntil)}</p>
            </div>
          </div>
          
          {proposal.additionalNotes && (
            <div className="mb-10">
              <h2 className={`text-xl font-semibold border-b pb-3 mb-6 ${plan === 'free' ? 'border-gray-200' : 'border-primary-200'}`}>
                Termos e condições
              </h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{proposal.additionalNotes}</p>
              </div>
            </div>
          )}
          
          {/* Contract Section */}
          {(proposal.includeContract || contractContent) && (
            <div className="mt-10 mb-10 page-break-before">
              <div className="print:hidden mb-6 flex items-center justify-between">
                <h2 className={`text-xl font-semibold ${plan === 'free' ? '' : 'text-primary-700'}`}>
                  Contrato de Prestação de Serviços
                </h2>
                <Button variant="outline" size="sm" onClick={toggleContract}>
                  {showContract ? "Ocultar contrato" : "Mostrar contrato"}
                </Button>
              </div>
              
              {showContract && (
                <div className={`border rounded-lg p-6 ${plan === 'free' ? 'border-gray-200' : 'border-primary-200'}`}>
                  <div className="prose max-w-none">
                    {contractContent ? (
                      <pre className="font-sans whitespace-pre-wrap">{contractContent}</pre>
                    ) : (
                      <>
                        <h2 className="text-center font-bold text-xl mb-6">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h2>
                        
                        <p>Pelo presente instrumento particular, as partes:</p>
                        
                        <p>
                          <strong>Contratante:</strong> {proposal.clientName}<br />
                          <strong>Contratado:</strong> {user?.name || "Nome do usuário"} {user?.companyName ? `- ${user.companyName}` : ""}
                        </p>
                        
                        <p>Têm entre si justo e contratado o que segue:</p>
                        
                        <p>
                          <strong>1. Objeto</strong><br />
                          O presente contrato tem como objeto a prestação dos seguintes serviços:<br />
                          {proposal.description || "Serviços conforme detalhado na proposta anexa."}
                        </p>
                        
                        <p>
                          <strong>2. Valor</strong><br />
                          Pelo serviço prestado, o contratante pagará ao contratado o valor total de {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(proposal.total)}, conforme descrito na proposta comercial anexa.
                        </p>
                        
                        <p>
                          <strong>3. Prazo de execução</strong><br />
                          Os serviços serão prestados no prazo de até {calculateDaysDifference(proposal.createdAt, proposal.deliveryDate)} dias corridos, contados a partir da confirmação do pagamento e aprovação desta proposta.
                        </p>
                        
                        <p>
                          <strong>4. Condições adicionais</strong><br />
                          {proposal.additionalNotes || "Não há condições adicionais especificadas."}
                        </p>
                        
                        <p>
                          <strong>5. Validade da proposta</strong><br />
                          Esta proposta é válida até {formatDate(proposal.validUntil)}. Após essa data, as condições poderão ser revistas.
                        </p>
                        
                        <p>
                          <strong>6. Disposições finais</strong><br />
                          Este contrato é firmado por ambas as partes de boa-fé. Qualquer alteração deverá ser feita por escrito.
                        </p>
                        
                        <p>{user?.location || "Local"}, {currentDate}.</p>
                        
                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="text-center">
                            <div className="border-t border-gray-400 pt-2">
                              {proposal.clientName} – Contratante
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="border-t border-gray-400 pt-2">
                              {user?.name || "Nome do usuário"} – Contratado
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-16 pt-8 border-t text-center">
            {plan !== 'free' && (
              <div className="mb-6">
                {user?.name && (
                  <p className="font-semibold text-lg mb-2">
                    {user.name}
                  </p>
                )}
                <Separator className="my-4 mx-auto w-16" />
              </div>
            )}
            
            <p className="text-sm text-gray-500">
              {user?.name || "Nome da empresa"}<br />
              {user?.email || "Email da empresa"}
            </p>
            
            {/* Free plan footer branding */}
            {plan === 'free' && (
              <div className="mt-8 text-xs text-gray-400 print:absolute print:bottom-4 print:left-0 print:right-0">
                Criado com PropostaPro - gerador de propostas comerciais profissionais
              </div>
            )}
          </div>
        </div>
      </div>
      
      {plan !== 'free' && (
        <Card className="print:hidden">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Próximos passos</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Proposta criada com sucesso</span>
              </div>
              <div className="flex items-center gap-2">
                <LucideStepIcon number={1} className="h-5 w-5 text-primary" />
                <span>Baixe em PDF e envie para seu cliente</span>
              </div>
              {plan === 'professional' ? (
                <div className="flex items-center gap-2">
                  <LucideStepIcon number={2} className="h-5 w-5 text-primary" />
                  <span>Compartilhe o link para aprovação online</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <LucideStepIcon number={2} className="h-5 w-5 text-gray-300" />
                  <span>Compartilhe o link para aprovação online (Plano Profissional)</span>
                </div>
              )}
            </div>
          </CardContent>
          
          {plan !== 'professional' && (
            <CardFooter className="bg-gray-50 border-t p-4">
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Deseja mais recursos avançados?
                </p>
                <Link to="/planos">
                  <Button variant="outline" className="text-primary border-primary hover:bg-primary-50">
                    Conheça o Plano Profissional
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardFooter>
          )}
        </Card>
      )}
      
      {/* Print-only styles */}
      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .proposal-page {
              box-shadow: none !important;
              border: none !important;
            }
            
            .page-break-before {
              page-break-before: always;
            }
          }

          /* Template styling based on plan */
          .proposal-template-premium {
            font-family: 'Inter', sans-serif;
            border-top: 4px solid #7a5aed;
          }
          
          .proposal-template-standard {
            font-family: 'Inter', sans-serif;
          }
          
          .proposal-template-basic {
            font-family: system-ui, sans-serif;
          }
        `}
      </style>
    </div>
  );
}

// Custom step icon component
function LucideStepIcon({ number, className }: { number: number, className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full h-5 w-5 text-xs font-medium ${className}`}>
      {number}
    </div>
  );
}

// Helper function to calculate days between dates
function calculateDaysDifference(startDateStr: string, endDateStr: string): number {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const differenceInTime = endDate.getTime() - startDate.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  return Math.max(1, differenceInDays); // Ensure at least 1 day
}

export default function ViewProposal() {
  return (
    <Layout>
      <ViewProposalContent />
    </Layout>
  );
}
