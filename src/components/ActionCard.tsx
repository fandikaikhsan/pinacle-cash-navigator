import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HelpCircle, TrendingUp } from "lucide-react";
import { Chip } from "./Chip";
import { AuditFooter } from "./AuditFooter";
import type { ActionCard as ActionCardType } from "@/types";
import { useState } from "react";
import { ExplainPanel } from "./ExplainPanel";

interface ActionCardProps {
  action: ActionCardType;
  onAction: (actionId: string) => void;
}

export const ActionCard = ({ action, onAction }: ActionCardProps) => {
  const [showExplain, setShowExplain] = useState(false);

  return (
    <>
      <Card className="p-5 shadow-card hover:shadow-lg transition-smooth space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground text-base leading-tight">{action.title}</h3>
            <Chip variant="success" size="sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              Impact
            </Chip>
          </div>
          <p className="text-sm text-muted-foreground">{action.summary}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-primary">{action.impactRange}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {action.reasonFactors.map((factor, idx) => (
              <Chip key={idx} variant="info" size="sm">
                {factor}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button onClick={() => onAction(action.id)} className="flex-1">
            {action.cta.label}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowExplain(true)}>
            <HelpCircle className="w-4 h-4 mr-1" />
            Why this?
          </Button>
        </div>

        <AuditFooter />
      </Card>

      <ExplainPanel
        isOpen={showExplain}
        onClose={() => setShowExplain(false)}
        title={action.title}
        factors={action.reasonFactors}
        impact={action.impactRange}
      />
    </>
  );
};
