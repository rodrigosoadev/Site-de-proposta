
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useSignature } from '@/contexts/SignatureContext';
import { Loader2, Mail, X } from 'lucide-react';

interface RequestSignatureModalProps {
  open: boolean;
  onClose: () => void;
  contractId: string;
  onSuccess?: () => void;
}

export default function RequestSignatureModal({
  open,
  onClose,
  contractId,
  onSuccess
}: RequestSignatureModalProps) {
  const [signatoryName, setSignatoryName] = useState('');
  const [signatoryEmail, setSignatoryEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createSignatureRequest } = useSignature();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signatoryName.trim() || !signatoryEmail.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e e-mail do signatário são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createSignatureRequest(contractId, [{
        name: signatoryName,
        email: signatoryEmail,
        status: 'pending'
      }]);
      
      // Reset form
      setSignatoryName('');
      setSignatoryEmail('');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating signature request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solicitar Assinatura</DialogTitle>
          <DialogDescription>
            Envie esta proposta para assinatura digital pelo cliente.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="signatoryName">Nome do Cliente</Label>
            <Input
              id="signatoryName"
              placeholder="Nome completo"
              value={signatoryName}
              onChange={(e) => setSignatoryName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signatoryEmail">E-mail do Cliente</Label>
            <Input
              id="signatoryEmail"
              type="email"
              placeholder="cliente@exemplo.com"
              value={signatoryEmail}
              onChange={(e) => setSignatoryEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Solicitação
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
