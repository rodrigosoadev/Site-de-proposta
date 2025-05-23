
import { useProposals } from "@/contexts/ProposalContext";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "./DashboardHeader";
import { PlanStatusCard } from "./PlanStatusCard";
import { MetricCards } from "./MetricCards";
import { RecentProposalsSection } from "./RecentProposalsSection";
import { GettingStartedSection } from "./GettingStartedSection";
import { ActivityFeed } from "./ActivityFeed";

export function DashboardContent() {
  const { filteredProposals } = useProposals();
  
  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MetricCards />
        </div>
        <div>
          <PlanStatusCard />
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentProposalsSection />
        </div>
        
        <div className="space-y-6">
          {filteredProposals.length < 4 && (
            <GettingStartedSection />
          )}
          
          {filteredProposals.length > 0 && (
            <ActivityFeed />
          )}
        </div>
      </div>
    </div>
  );
}
