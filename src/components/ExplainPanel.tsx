import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TrendingUp, CheckCircle2 } from "lucide-react";
import { Chip } from "./Chip";

interface ExplainPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  factors: string[];
  impact: string;
}

export const ExplainPanel = ({ isOpen, onClose, title, factors, impact }: ExplainPanelProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Why this recommendation?</SheetTitle>
          <SheetDescription>{title}</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Expected Impact</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-7">{impact}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Top Factors</h3>
            <div className="space-y-2">
              {factors.map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{factor}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Data Sources</h3>
            <div className="flex flex-wrap gap-2">
              <Chip variant="info">Transaction history</Chip>
              <Chip variant="info">Invoice data</Chip>
              <Chip variant="info">Industry benchmarks</Chip>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              This recommendation is based on your business data from the last 90 days and validated against industry patterns.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
