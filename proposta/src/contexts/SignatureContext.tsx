
import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

export interface Signatory {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'signed' | 'rejected';
  signed_at?: string;
  verification_token?: string;
  signature_image?: string;
  signature_request_id: string;
}

export interface SignatureRequest {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  contract_id: string;
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  expires_at: string;
  signatories?: Signatory[];
}

interface SignatureContextType {
  createSignatureRequest: (contractId: string, signatories: Omit<Signatory, 'id' | 'signature_request_id' | 'verification_token'>[]) => Promise<SignatureRequest>;
  getSignatureRequestsByUser: () => Promise<SignatureRequest[]>;
  getSignatureRequestById: (id: string) => Promise<SignatureRequest | null>;
  getSignatoryByToken: (token: string) => Promise<Signatory | null>;
  updateSignatureStatus: (signatoryId: string, status: 'signed' | 'rejected', signatureImage?: string, comment?: string) => Promise<void>;
  resendSignatureRequest: (signatoryId: string) => Promise<void>;
  cancelSignatureRequest: (requestId: string) => Promise<void>;
  isLoading: boolean;
}

const SignatureContext = createContext<SignatureContextType | undefined>(undefined);

export function SignatureProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const createSignatureRequest = async (contractId: string, signatories: Omit<Signatory, 'id' | 'signature_request_id' | 'verification_token'>[]) => {
    setIsLoading(true);
    
    try {
      // 1. Create signature request
      const { data: requestData, error: requestError } = await supabase
        .from('signature_requests')
        .insert({
          created_by: user?.id,
          contract_id: contractId,
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        })
        .select('*')
        .single();
        
      if (requestError) throw requestError;
      
      // 2. Create signatories with verification tokens
      const signatoriesToInsert = signatories.map(signatory => ({
        ...signatory,
        signature_request_id: requestData.id,
        verification_token: uuidv4(), // Generate unique token for verification
      }));
      
      const { data: signatoryData, error: signatoryError } = await supabase
        .from('signatories')
        .insert(signatoriesToInsert)
        .select('*');
        
      if (signatoryError) throw signatoryError;
      
      // 3. Send emails to signatories (using edge function)
      for (const signatory of signatoryData) {
        try {
          await supabase.functions.invoke('send-signature-email', {
            body: { signatoryId: signatory.id }
          });
        } catch (err) {
          console.error('Error sending email to signatory:', err);
        }
      }
      
      // 4. Log audit event
      await supabase
        .from('audit_events')
        .insert({
          signature_request_id: requestData.id,
          event_type: 'signature_request_created',
          event_data: { created_by: user?.id },
        });
      
      toast({
        title: "Solicitação de assinatura enviada",
        description: "Os signatários foram notificados por e-mail.",
      });
      
      return {
        ...requestData,
        signatories: signatoryData,
      } as SignatureRequest;
    } catch (error: any) {
      console.error('Error creating signature request:', error);
      toast({
        title: "Erro ao criar solicitação de assinatura",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSignatureRequestsByUser = async () => {
    try {
      // Get all signature requests created by the current user
      const { data: requests, error: requestsError } = await supabase
        .from('signature_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (requestsError) throw requestsError;
      
      // Get all signatories for these requests
      const requestIds = requests.map(req => req.id);
      const { data: signatories, error: signatoriesError } = await supabase
        .from('signatories')
        .select('*')
        .in('signature_request_id', requestIds);
        
      if (signatoriesError) throw signatoriesError;
      
      // Combine data
      const requestsWithSignatories = requests.map(request => ({
        ...request,
        signatories: signatories.filter(s => s.signature_request_id === request.id)
      })) as SignatureRequest[];
      
      return requestsWithSignatories;
    } catch (error) {
      console.error('Error fetching signature requests:', error);
      return [];
    }
  };
  
  const getSignatureRequestById = async (id: string) => {
    try {
      // Get the signature request
      const { data: request, error: requestError } = await supabase
        .from('signature_requests')
        .select('*')
        .eq('id', id)
        .single();
        
      if (requestError) throw requestError;
      
      // Get signatories for this request
      const { data: signatories, error: signatoriesError } = await supabase
        .from('signatories')
        .select('*')
        .eq('signature_request_id', id);
        
      if (signatoriesError) throw signatoriesError;
      
      return {
        ...request,
        signatories,
      } as SignatureRequest;
    } catch (error) {
      console.error('Error fetching signature request:', error);
      return null;
    }
  };
  
  const getSignatoryByToken = async (token: string) => {
    try {
      const { data, error } = await supabase
        .from('signatories')
        .select('*')
        .eq('verification_token', token)
        .single();
        
      if (error) throw error;
      
      // Check if the signature request is expired
      const { data: request, error: requestError } = await supabase
        .from('signature_requests')
        .select('expires_at, status')
        .eq('id', data.signature_request_id)
        .single();
        
      if (requestError) throw requestError;
      
      // Check if expired or cancelled
      if (request.status === 'cancelled' || request.status === 'expired' || 
          new Date(request.expires_at) < new Date()) {
        throw new Error('This signature request has expired or been cancelled.');
      }
      
      return data as Signatory;
    } catch (error) {
      console.error('Error fetching signatory by token:', error);
      return null;
    }
  };
  
  const updateSignatureStatus = async (signatoryId: string, status: 'signed' | 'rejected', signatureImage?: string, comment?: string) => {
    setIsLoading(true);
    
    try {
      // Get signatory info first to get the signature request ID
      const { data: signatory, error: getError } = await supabase
        .from('signatories')
        .select('signature_request_id')
        .eq('id', signatoryId)
        .single();
        
      if (getError) throw getError;
      
      // Update signatory status
      const updateData: any = {
        status,
        signed_at: new Date().toISOString(),
        ip_address: await fetch('https://api.ipify.org').then(res => res.text()),
      };
      
      if (signatureImage) {
        updateData.signature_image = signatureImage;
      }
      
      const { error: updateError } = await supabase
        .from('signatories')
        .update(updateData)
        .eq('id', signatoryId);
        
      if (updateError) throw updateError;
      
      // Log audit event
      await supabase
        .from('audit_events')
        .insert({
          signature_request_id: signatory.signature_request_id,
          signatory_id: signatoryId,
          event_type: `signature_${status}`,
          event_data: { comment },
          ip_address: updateData.ip_address,
        });
      
      // Check if all signatories have signed and update request status if needed
      const { data: allSignatories, error: checkError } = await supabase
        .from('signatories')
        .select('status')
        .eq('signature_request_id', signatory.signature_request_id);
        
      if (checkError) throw checkError;
      
      const allSigned = allSignatories.every(s => s.status === 'signed');
      const anyRejected = allSignatories.some(s => s.status === 'rejected');
      
      if (allSigned || anyRejected) {
        const newStatus = allSigned ? 'completed' : 'cancelled';
        
        await supabase
          .from('signature_requests')
          .update({ status: newStatus })
          .eq('id', signatory.signature_request_id);
      }
      
      toast({
        title: status === 'signed' ? "Assinatura realizada" : "Assinatura rejeitada",
        description: status === 'signed' 
          ? "Documento assinado com sucesso." 
          : "Você rejeitou esta solicitação de assinatura.",
      });
    } catch (error: any) {
      console.error('Error updating signature status:', error);
      toast({
        title: "Erro ao processar assinatura",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const resendSignatureRequest = async (signatoryId: string) => {
    setIsLoading(true);
    
    try {
      await supabase.functions.invoke('send-signature-email', {
        body: { signatoryId, resend: true }
      });
      
      toast({
        title: "E-mail reenviado",
        description: "Uma nova solicitação de assinatura foi enviada.",
      });
    } catch (error: any) {
      console.error('Error resending signature request:', error);
      toast({
        title: "Erro ao reenviar solicitação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const cancelSignatureRequest = async (requestId: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('signature_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId);
        
      if (error) throw error;
      
      // Log audit event
      await supabase
        .from('audit_events')
        .insert({
          signature_request_id: requestId,
          event_type: 'signature_request_cancelled',
          event_data: { cancelled_by: user?.id },
        });
      
      toast({
        title: "Solicitação cancelada",
        description: "A solicitação de assinatura foi cancelada.",
      });
    } catch (error: any) {
      console.error('Error cancelling signature request:', error);
      toast({
        title: "Erro ao cancelar solicitação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SignatureContext.Provider value={{
      createSignatureRequest,
      getSignatureRequestsByUser,
      getSignatureRequestById,
      getSignatoryByToken,
      updateSignatureStatus,
      resendSignatureRequest,
      cancelSignatureRequest,
      isLoading
    }}>
      {children}
    </SignatureContext.Provider>
  );
}

export function useSignature() {
  const context = useContext(SignatureContext);
  if (context === undefined) {
    throw new Error('useSignature must be used within a SignatureProvider');
  }
  return context;
}
