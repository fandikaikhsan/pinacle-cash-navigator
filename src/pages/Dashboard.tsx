import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { HeaderSummary } from "@/components/HeaderSummary";
import { ScoreDial } from "@/components/ScoreDial";
import { SubScoreList } from "@/components/SubScoreList";
import { ActionCard } from "@/components/ActionCard";
import { KPIStat } from "@/components/KPIStat";
import { Chip } from "@/components/Chip";
import { AINutritionLabel } from "@/components/AINutritionLabel";
import { ConsentToggle } from "@/components/ConsentToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getScore, getActions, getConsent, updateConsent } from "@/services/mockApi";
import type { ScoreSummary, ActionCard as ActionCardType } from "@/types";
import { toast } from "sonner";

const Dashboard = () => {
  const [score, setScore] = useState<ScoreSummary | null>(null);
  const [actions, setActions] = useState<ActionCardType[]>([]);
  const [showNutritionLabel, setShowNutritionLabel] = useState(false);
  const [consents, setConsents] = useState<Array<{ source: string; enabled: boolean }>>([]);
  const [showConsentBanner, setShowConsentBanner] = useState(true);

  useEffect(() => {
    Promise.all([getScore(), getActions(), getConsent()]).then(([scoreData, actionsData, consentData]) => {
      setScore(scoreData);
      setActions(actionsData);
      setConsents(consentData);
    });
  }, []);

  const handleAction = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    toast.success(`Action initiated: ${action?.cta.label}`);
  };

  const handleConsentChange = async (source: string, enabled: boolean) => {
    await updateConsent(source, enabled);
    setConsents(prev => prev.map(c => c.source === source ? { ...c, enabled } : c));
    toast.success(`${source} consent ${enabled ? 'enabled' : 'disabled'}`);
  };

  if (!score) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderSummary inAmount={245000} outAmount={187000} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {showConsentBanner && (
          <Card className="p-5 bg-accent/5 border-accent/20 shadow-card animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">Enable Financial Insights</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Allow PINACLE to analyze your data for personalized recommendations
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowConsentBanner(false)}>
                  Dismiss
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {consents.slice(0, 4).map(consent => (
                  <ConsentToggle
                    key={consent.source}
                    source={consent.source}
                    purpose={`Analyze ${consent.source} for insights`}
                    enabled={consent.enabled}
                    onChange={(enabled) => handleConsentChange(consent.source, enabled)}
                  />
                ))}
              </div>
            </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-6 shadow-card space-y-6 animate-scale-in">
            <div className="flex items-center justify-center">
              <ScoreDial score={score.overall} delta={score.delta7d} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <KPIStat
                label="Buffer Days"
                value={score.bufferDays.current}
                delta={`Target: ${score.bufferDays.target}`}
                size="md"
              />
              <KPIStat
                label="Peer Ranking"
                value={`${score.peerPercentile}th`}
                size="md"
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowNutritionLabel(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              View AI Details
            </Button>
          </Card>

          <Card className="p-6 shadow-card animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="font-semibold text-foreground mb-4">Health Breakdown</h3>
            <SubScoreList subScores={score.subScores} />
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Do Next</h2>
            <Chip variant="info">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Recommended
            </Chip>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action, idx) => (
              <div
                key={action.id}
                className="animate-fade-in"
                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
              >
                <ActionCard action={action} onAction={handleAction} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <AINutritionLabel
        isOpen={showNutritionLabel}
        onClose={() => setShowNutritionLabel(false)}
        label={{
          featureId: "wellness_score",
          purpose: "Calculate financial wellness score and predict cash buffer days",
          dataUsed: ["transactions", "balances", "invoices", "bills"],
          dataNotUsed: ["owner_demographics", "personal_credit_history"],
          model: {
            name: "Cash Health Predictor v2",
            version: "2.3.1",
            lastUpdated: "2025-09-15",
            method: "Gradient boosting ensemble",
            validation: "90-day rolling validation; MAE ±3.2 days",
          },
          topFactors: ["DSO trend (7d)", "LOC utilization", "Payment velocity", "Seasonal variance"],
          uncertainty: "±4 score points; buffer days ±3–5 days (80% confidence)",
          limits: ["<6 weeks history reduces stability", "Seasonal businesses may see wider bands"],
          controls: {
            toggles: consents,
          },
        }}
      />
    </div>
  );
};

export default Dashboard;
