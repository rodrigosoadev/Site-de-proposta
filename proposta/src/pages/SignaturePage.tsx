
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import SigningPad from "@/components/signature/SigningPad";
import { useSignature } from "@/contexts/SignatureContext";
import { supabase } from "@/integrations/supabase/client";
import { FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function SignaturePage() {
  const { token } = useParams<{ token: string }>();
  const [signatory, setSignatory] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [sender, setSender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [action, setAction] = useState<'sign' | 'reject' | null>(null);
  
  const { updateSignatureStatus } = useSignature();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      if (!token) {
        setError("Token de verificação inválido.");
        setLoading(false);
        return;
      }

      try {
        // Get signatory by token
        const { data: signatoryData, error: signatoryError } = await supabase
          .from('signatories')
          .select('*, signature_requests(*)')
          .eq('verification_token', token)
          .single();

        if (signatoryError || !signatoryData) {
          throw new Error("Token de verificação inválido ou expirado.");
        }

        setSignatory(signatoryData);

        // If already signed or rejected, show appropriate message
        if (signatoryData.status !== 'pending') {
          setCompleted(true);
          setAction(signatoryData.status as 'sign' | 'reject');
        }

        // Get contract
        const { data: contractData, error: contractError } = await supabase
          .from('contracts')
          .select('*, proposals(*)')
          .eq('id', signatoryData.signature_requests.contract_id)
          .single();

        if (contractError || !contractData) {
          throw new Error("Documento não encontrado.");
        }

        setContract(contractData);
        setProposal(contractData.proposals);

        // Get sender info
        const { data: senderData, error: senderError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signatoryData.signature_requests.created_by)
          .single();

        if (!senderError && senderData) {
          setSender(senderData);
        }
        
      } catch (error: any) {
        console.error("Error loading signature data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  const handleSign = async () => {
    if (!signatureImage) {
      toast({
        title: "Assinatura necessária",
        description: "Por favor, assine o documento antes de prosseguir.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateSignatureStatus(
        signatory.id,
        'signed',
        signatureImage,
        comment
      );
      
      setCompleted(true);
      setAction('sign');
      
    } catch (error: any) {
      console.error("Error signing document:", error);
      toast({
        title: "Erro ao assinar documento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    
    try {
      await updateSignatureStatus(
        signatory.id,
        'rejected',
        null,
        comment
      );
      
      setCompleted(true);
      setAction('reject');
      
    } catch (error: any) {
      console.error("Error rejecting document:", error);
      toast({
        title: "Erro ao rejeitar documento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Carregando documento...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Link Inválido</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p>{error}</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Link to="/">
              <Button>Voltar para a Página Inicial</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {action === 'sign' ? 'Documento Assinado' : 'Documento Rejeitado'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {action === 'sign' ? (
              <>
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium">Sua assinatura foi registrada com sucesso!</p>
                <p className="mt-2 text-gray-600">Obrigado por assinar este documento.</p>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-medium">Você rejeitou este documento.</p>
                <p className="mt-2 text-gray-600">O autor da proposta será notificado.</p>
              </>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <Link to="/">
              <Button>Voltar para a Página Inicial</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <Link to="/" className="text-primary-600 font-bold text-xl flex items-center">
            <FileText className="mr-2" />
            <span>PropostaPro</span>
          </Link>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Solicitação de Assinatura</CardTitle>
                <CardDescription>
                  {sender?.name || 'Um usuário'} da empresa {sender?.company_name || 'não informada'} 
                  está solicitando sua assinatura neste documento.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-md border">
              <h2 className="font-medium text-lg mb-2">
                {proposal?.client_name ? `Proposta para: ${proposal.client_name}` : 'Proposta Comercial'}
              </h2>
              {proposal?.description && (
                <p className="text-gray-600 mb-4">{proposal.description}</p>
              )}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor Total:</span>
                  <span className="font-medium">
                    {proposal?.total && new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(proposal.total)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Data de Entrega:</span>
                  <span>
                    {proposal?.delivery_date && new Date(proposal.delivery_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Válido até:</span>
                  <span>
                    {proposal?.valid_until && new Date(proposal.valid_until).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Contrato</h3>
              <div className="bg-white border rounded-md p-4 whitespace-pre-line max-h-96 overflow-y-auto">
                {contract?.content || "Conteúdo do contrato não disponível."}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Sua Assinatura</h3>
              <SigningPad onChange={setSignatureImage} />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Comentários (opcional)</h3>
              <Textarea 
                placeholder="Adicione observações ou comentários sobre este documento..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleReject}
              disabled={isSubmitting}
            >
              {isSubmitting && action === 'reject' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeitar
                </>
              )}
            </Button>
            <Button 
              onClick={handleSign}
              disabled={isSubmitting || !signatureImage}
            >
              {isSubmitting && action === 'sign' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Assinar Documento
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center text-sm text-gray-500">
          <p>
            Se você tiver alguma dúvida sobre este documento, entre em contato diretamente com 
            {sender?.name ? ` ${sender.name}` : ' o remetente'} 
            {sender?.email && ` em ${sender.email}`}.
          </p>
        </div>
      </div>
    </div>
  );
}
