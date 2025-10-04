import { useState } from "react";
import { Play, RotateCcw, Sparkles, AlertTriangle } from "lucide-react";
import { HeaderSummary } from "@/components/HeaderSummary";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { KPIStat } from "@/components/KPIStat";
import { Chip } from "@/components/Chip";
import { AINutritionLabel } from "@/components/AINutritionLabel";
import { runSandbox } from "@/services/mockApi";
import type { SandboxInput, SandboxResult } from "@/types";
import { toast } from "sonner";

const Sandbox = () => {
  const [inputs, setInputs] = useState<SandboxInput>({
    dsoDeltaDays: 0,
    shiftPayablesDays: 0,
    priceChangePct: 0,
    reserveSweepPct: 0,
  });
  const [result, setResult] = useState<SandboxResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNutritionLabel, setShowNutritionLabel] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    try {
      const sandboxResult = await runSandbox(inputs);
      setResult(sandboxResult);
    } catch (error) {
      toast.error("Failed to run simulation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputs({
      dsoDeltaDays: 0,
      shiftPayablesDays: 0,
      priceChangePct: 0,
      reserveSweepPct: 0,
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderSummary inAmount={245000} outAmount={187000} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Scenario Simulator</h1>
            <p className="text-muted-foreground mt-1">Test what-if scenarios to optimize your cash position</p>
          </div>
          <Button variant="outline" onClick={() => setShowNutritionLabel(true)}>
            <Sparkles className="w-4 h-4 mr-2" />
            AI Info
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Scenario Controls</h3>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>DSO Change (days)</Label>
                  <Chip variant="info">{inputs.dsoDeltaDays! > 0 ? `+${inputs.dsoDeltaDays}` : inputs.dsoDeltaDays}</Chip>
                </div>
                <Slider
                  value={[inputs.dsoDeltaDays!]}
                  onValueChange={([v]) => setInputs(prev => ({ ...prev, dsoDeltaDays: v }))}
                  min={-10}
                  max={10}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">Adjust how quickly customers pay you</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Shift Payables (days)</Label>
                  <Chip variant="info">{inputs.shiftPayablesDays! > 0 ? `+${inputs.shiftPayablesDays}` : inputs.shiftPayablesDays}</Chip>
                </div>
                <Slider
                  value={[inputs.shiftPayablesDays!]}
                  onValueChange={([v]) => setInputs(prev => ({ ...prev, shiftPayablesDays: v }))}
                  min={-15}
                  max={15}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">Adjust payment timing within terms</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Price Change (%)</Label>
                  <Chip variant="info">{inputs.priceChangePct! > 0 ? `+${inputs.priceChangePct}` : inputs.priceChangePct}%</Chip>
                </div>
                <Slider
                  value={[inputs.priceChangePct!]}
                  onValueChange={([v]) => setInputs(prev => ({ ...prev, priceChangePct: v }))}
                  min={-5}
                  max={10}
                  step={0.5}
                />
                <p className="text-xs text-muted-foreground">Test pricing strategy impact</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Reserve Sweep (%)</Label>
                  <Chip variant="info">{inputs.reserveSweepPct}%</Chip>
                </div>
                <Slider
                  value={[inputs.reserveSweepPct!]}
                  onValueChange={([v]) => setInputs(prev => ({ ...prev, reserveSweepPct: v }))}
                  min={0}
                  max={10}
                  step={0.5}
                />
                <p className="text-xs text-muted-foreground">Automatically save % of inflows</p>
              </div>
            </div>

            <Button className="w-full" onClick={handleRun} disabled={isLoading}>
              <Play className="w-4 h-4 mr-2" />
              {isLoading ? "Running..." : "Run Simulation"}
            </Button>
          </Card>

          <Card className="p-6 shadow-card space-y-6">
            <h3 className="font-semibold text-foreground">Projected Results</h3>

            {result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {result.kpis.map((kpi, idx) => (
                    <KPIStat
                      key={idx}
                      label={kpi.label}
                      value={kpi.value}
                      delta={kpi.delta}
                      trend={kpi.delta && parseFloat(kpi.delta) > 0 ? "up" : "down"}
                      size="md"
                    />
                  ))}
                </div>

                {result.warnings && result.warnings.length > 0 && (
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">Advisories</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {result.warnings.map((warning, idx) => (
                            <li key={idx}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="pt-4 border-t border-border">
                  <Button variant="outline" className="w-full">
                    Apply as Plan
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    This will save these settings as your target scenario
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-center">
                <div className="space-y-2">
                  <Play className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Adjust the controls and run a simulation to see projected results
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <AINutritionLabel
        isOpen={showNutritionLabel}
        onClose={() => setShowNutritionLabel(false)}
        label={{
          featureId: "sandbox_forecast",
          purpose: "Simulate cash flow scenarios and predict outcomes based on user inputs",
          dataUsed: ["historical transactions", "current balances", "payment patterns"],
          dataNotUsed: ["owner demographics", "personal credit history"],
          model: {
            name: "Cash Flow Simulator v1",
            version: "1.2.0",
            lastUpdated: "2025-09-10",
            method: "Time-series forecasting with scenario modeling",
            validation: "Historical back-testing; 85% accuracy within ±5 days",
          },
          topFactors: ["Historical volatility", "Seasonal patterns", "Payment velocity", "Customer concentration"],
          uncertainty: "Results are projections; actual outcomes may vary ±10-15%",
          limits: ["Assumes stable market conditions", "Does not account for unexpected events"],
          controls: {
            toggles: [
              { source: "transactions", enabled: true },
              { source: "balances", enabled: true },
            ],
          },
        }}
      />
    </div>
  );
};

export default Sandbox;
