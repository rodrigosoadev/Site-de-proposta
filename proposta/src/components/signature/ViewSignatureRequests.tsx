
import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useSignature, SignatureRequest } from "@/contexts/SignatureContext";
import SignatureStatusBadge from "./SignatureStatusBadge";
import { Send, Mail, Copy, Check, X, Loader2, FileText } from "lucide-react";

interface ViewSignatureRequestsProps {
  contractId: string;
  open: boolean;
  onClose: () => void;
}

export default function ViewSignatureRequests({ contractId, open, onClose }: ViewSignatureRequestsProps) {
  const [requests, setRequests] = useState<SignatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  
  const { getSignatureRequestsByUser, resendSignatureRequest, cancelSignatureRequest } = useSignature();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchRequests();
    }
  }, [open]);

  const fetchRequests = async () => {
    setLoading(true);
    
    try {
      const allRequests = await getSignatureRequestsByUser();
      const filteredRequests = allRequests.filter(request => request.contract_id === contractId);
      setRequests(filteredRequests);
    } catch (error) {
      console.error("Error fetching signature requests:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopyLink = (token: string) => {
    const baseUrl = window.location.origin;
    const signatureUrl = `${baseUrl}/assinatura/${token}`;
    
    navigator.clipboard.writeText(signatureUrl);
    
    setCopied(prev => ({
      ...prev,
      [token]: true
    }));
    
    setTimeout(() => {
      setCopied(prev => ({
        ...prev,
        [token]: false
      }));
    }, 3000);
    
    toast({
      title: "Link copiado!",
      description: "Link de assinatura copiado para a área de transferência.",
    });
  };
  
  const handleResend = async (signatoryId: string) => {
    try {
      await resendSignatureRequest(signatoryId);
      await fetchRequests();
    } catch (error) {
      console.error("Error resending signature request:", error);
    }
  };
  
  const handleCancel = async (requestId: string) => {
    if (confirm("Tem certeza que deseja cancelar esta solicitação de assinatura?")) {
      try {
        await cancelSignatureRequest(requestId);
        await fetchRequests();
      } catch (error) {
        console.error("Error cancelling signature request:", error);
      }
    }
  };
  
  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Solicitações de Assinatura</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <div className="py-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">Nenhuma solicitação enviada</p>
            <p className="text-gray-500 mb-6">
              Você ainda não enviou solicitações de assinatura para esta proposta.
            </p>
          </div>
        ) : (
          <div className="space-y-4 my-4">
            {requests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <SignatureStatusBadge 
                      status={
                        isExpired(request.expires_at) && request.status === 'pending' 
                          ? 'expired' 
                          : request.status
                      } 
                    />
                    <span className="text-xs text-gray-500 ml-2">
                      Criado em {new Date(request.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  {request.status === 'pending' && !isExpired(request.expires_at) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleCancel(request.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                </div>
                
                {request.signatories && request.signatories.map((signatory: any) => (
                  <div 
                    key={signatory.id} 
                    className="border rounded-md p-3 mb-2 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{signatory.name}</p>
                      <p className="text-sm text-gray-500">{signatory.email}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      {signatory.status === 'pending' && !isExpired(request.expires_at) && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(signatory.verification_token)}
                          >
                            {copied[signatory.verification_token] ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                Link
                              </>
                            )}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResend(signatory.id)}
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Reenviar
                          </Button>
                        </>
                      )}
                      
                      <SignatureStatusBadge 
                        status={signatory.status} 
                        className="h-6 py-0 flex items-center"
                      />
                    </div>
                  </div>
                ))}
                
                {isExpired(request.expires_at) && request.status === 'pending' && (
                  <div className="text-sm text-amber-600 mt-2">
                    Esta solicitação expirou em {new Date(request.expires_at).toLocaleDateString('pt-BR')}.
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
