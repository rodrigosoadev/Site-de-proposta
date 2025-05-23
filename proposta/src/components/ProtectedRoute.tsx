
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPlan?: 'free' | 'intermediate' | 'professional';
}

const ProtectedRoute = ({ children, requiredPlan }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { plan, isLoading: subscriptionLoading } = useSubscription();

  if (isLoading || subscriptionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if this route requires a specific plan
  if (requiredPlan && requiredPlan !== 'free') {
    const planHierarchy = {
      'free': 0,
      'intermediate': 1,
      'professional': 2
    };
    
    // Redirect to plans page if user doesn't have the required plan level
    if (planHierarchy[plan] < planHierarchy[requiredPlan]) {
      return <Navigate to="/planos?upgrade=true" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
