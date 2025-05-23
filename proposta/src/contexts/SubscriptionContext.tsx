
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { PlanType, canCreateProposal, getProposalsRemaining } from '@/config/plans';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface SubscriptionContextType {
  plan: PlanType;
  usedProposals: number;
  proposalsRemaining: number;
  canCreateNewProposal: boolean;
  isLoading: boolean;
  updatePlan: (newPlan: PlanType) => void;
  incrementUsedProposals: () => void;
  resetUsedProposals: () => void;
  showUpgradeModal: () => void;
  showShareUpgradeModal: () => void;
  upgradePlan: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Key for storing subscription data in localStorage
const STORAGE_KEY_PREFIX = 'propostas-app-subscription-';
const USAGE_RESET_KEY = 'propostas-app-usage-reset-date';

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plan, setPlan] = useState<PlanType>('free');
  const [usedProposals, setUsedProposals] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModalState, setShowUpgradeModalState] = useState(false);
  const [showShareUpgradeModalState, setShowShareUpgradeModalState] = useState(false);

  // Calculate proposalsRemaining and canCreateNewProposal
  const proposalsRemaining = getProposalsRemaining(plan, usedProposals);
  const canCreateNewProposal = canCreateProposal(plan, usedProposals);

  // Check if we need to reset usage (if it's a new month)
  useEffect(() => {
    const checkAndResetMonthlyUsage = () => {
      const resetDateStr = localStorage.getItem(USAGE_RESET_KEY);
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      if (!resetDateStr) {
        // Initialize reset date if not set
        localStorage.setItem(USAGE_RESET_KEY, JSON.stringify({ month: currentMonth, year: currentYear }));
        return;
      }

      const { month, year } = JSON.parse(resetDateStr);
      
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        // It's a new month, reset usage
        setUsedProposals(0);
        localStorage.setItem(USAGE_RESET_KEY, JSON.stringify({ month: currentMonth, year: currentYear }));
        
        // Only show notification if the user is actually using the app (has created proposals)
        if (usedProposals > 0) {
          toast({
            title: "Uso mensal reiniciado!",
            description: "O limite de propostas foi redefinido para este mês.",
          });
        }
      }
    };

    checkAndResetMonthlyUsage();
  }, [toast, usedProposals]);

  // Load user subscription data when the component mounts or user changes
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const userSubKey = `${STORAGE_KEY_PREFIX}${user.id}`;
      const savedData = localStorage.getItem(userSubKey);

      if (savedData) {
        const { plan: savedPlan, usedProposals: savedUsage } = JSON.parse(savedData);
        setPlan(savedPlan);
        setUsedProposals(savedUsage);
      } else {
        // Default for new users
        setPlan('free');
        setUsedProposals(0);
      }

      setIsLoading(false);
    }
  }, [user]);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (user) {
      const userSubKey = `${STORAGE_KEY_PREFIX}${user.id}`;
      localStorage.setItem(userSubKey, JSON.stringify({ plan, usedProposals }));
    }
  }, [user, plan, usedProposals]);

  const updatePlan = (newPlan: PlanType) => {
    setPlan(newPlan);
    toast({
      title: "Plano atualizado!",
      description: `Seu plano foi atualizado para ${newPlan === 'free' ? 'Gratuito' : newPlan === 'intermediate' ? 'Intermediário' : 'Profissional'}.`,
    });
  };

  const incrementUsedProposals = () => {
    setUsedProposals(prev => prev + 1);
  };

  const resetUsedProposals = () => {
    setUsedProposals(0);
  };

  const showUpgradeModal = () => {
    setShowUpgradeModalState(true);
  };

  const showShareUpgradeModal = () => {
    setShowShareUpgradeModalState(true);
  };

  const upgradePlan = () => {
    // This would be replaced with actual checkout flow
    window.location.href = '/planos';
  };

  return (
    <SubscriptionContext.Provider value={{
      plan,
      usedProposals,
      proposalsRemaining,
      canCreateNewProposal,
      isLoading,
      updatePlan,
      incrementUsedProposals,
      resetUsedProposals,
      showUpgradeModal: () => setShowUpgradeModalState(true),
      showShareUpgradeModal: () => setShowShareUpgradeModalState(true),
      upgradePlan,
    }}>
      {children}
      {showUpgradeModalState && (
        <UpgradeModal 
          isOpen={showUpgradeModalState} 
          onClose={() => setShowUpgradeModalState(false)}
          onUpgrade={upgradePlan}
        />
      )}
      {showShareUpgradeModalState && (
        <ShareUpgradeModal 
          isOpen={showShareUpgradeModalState} 
          onClose={() => setShowShareUpgradeModalState(false)}
          onUpgrade={upgradePlan}
        />
      )}
    </SubscriptionContext.Provider>
  );
}

// Component for the upgrade modal
function UpgradeModal({ 
  isOpen, 
  onClose, 
  onUpgrade 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onUpgrade: () => void; 
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Recurso Premium</h2>
        <p className="mb-4">
          Você está utilizando o plano gratuito, que permite criar apenas uma proposta. Para criar mais, faça o upgrade para um plano premium.
        </p>
        <div className="flex justify-end gap-2">
          <button 
            className="px-4 py-2 border rounded-md"
            onClick={onClose}
          >
            Fechar
          </button>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={onUpgrade}
          >
            Ver planos
          </button>
        </div>
      </div>
    </div>
  );
}

// Component for the share upgrade modal
function ShareUpgradeModal({ 
  isOpen, 
  onClose, 
  onUpgrade 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onUpgrade: () => void; 
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">🔒 Recurso Premium</h2>
        <p className="mb-4">
          O compartilhamento de propostas é exclusivo para usuários do plano premium.
          Faça o upgrade do seu plano para enviar propostas por link ou e-mail.
        </p>
        <div className="flex justify-end gap-2">
          <button 
            className="px-4 py-2 border rounded-md"
            onClick={onClose}
          >
            Fechar
          </button>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={onUpgrade}
          >
            Ver planos
          </button>
        </div>
      </div>
    </div>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
