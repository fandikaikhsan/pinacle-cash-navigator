import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Database, Shield, AlertCircle, ExternalLink } from "lucide-react";
import { Chip } from "./Chip";
import { ConsentToggle } from "./ConsentToggle";
import type { AINutritionLabel as AINutritionLabelType } from "@/types";
import { useState } from "react";

interface AINutritionLabelProps {
  isOpen: boolean;
  onClose: () => void;
  label: AINutritionLabelType;
}

export const AINutritionLabel = ({ isOpen, onClose, label }: AINutritionLabelProps) => {
  const [toggles, setToggles] = useState(label.controls.toggles);

  const handleToggle = (source: string, enabled: boolean) => {
    setToggles(prev => prev.map(t => t.source === source ? { ...t, enabled } : t));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Nutrition Label
          </DialogTitle>
          <DialogDescription>Transparency about how AI powers this feature</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Purpose</h3>
            <p className="text-sm text-muted-foreground">{label.purpose}</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">Data Used</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {label.dataUsed.map((data, idx) => (
                <Chip key={idx} variant="info">{data}</Chip>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Data NOT used: {label.dataNotUsed.join(", ")}</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              <h3 className="font-semibold text-foreground">Model Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">{label.model.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Version</p>
                <p className="font-medium text-foreground">{label.model.version}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium text-foreground">{label.model.lastUpdated}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Method</p>
                <p className="font-medium text-foreground">{label.model.method}</p>
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs font-medium text-foreground">Validation</p>
              <p className="text-xs text-muted-foreground mt-1">{label.model.validation}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Top Factors Considered</h3>
            <div className="space-y-2">
              {label.topFactors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-primary font-medium">{idx + 1}.</span>
                  <span className="text-foreground">{factor}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Uncertainty & Limits</h3>
            </div>
            <p className="text-sm text-muted-foreground">{label.uncertainty}</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {label.limits.map((limit, idx) => (
                <li key={idx}>{limit}</li>
              ))}
            </ul>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Data Source Controls</h3>
            <div className="space-y-2">
              {toggles.map((toggle) => (
                <ConsentToggle
                  key={toggle.source}
                  source={toggle.source}
                  purpose={`Use ${toggle.source} data for AI insights`}
                  enabled={toggle.enabled}
                  onChange={(enabled) => handleToggle(toggle.source, enabled)}
                />
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1" asChild>
              <a href="#" className="flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Talk to a banker
              </a>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href="#" className="flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Report issue
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
