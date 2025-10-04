import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScoreSummary } from "@/types";

interface SubScoreListProps {
  subScores: ScoreSummary["subScores"];
}

export const SubScoreList = ({ subScores }: SubScoreListProps) => {
  return (
    <div className="space-y-4">
      {subScores.map((sub) => {
        const scoreColor = sub.value >= 70 ? "bg-success" : sub.value >= 40 ? "bg-primary" : "bg-error";
        const deltaIcon = sub.delta7d > 0 ? <ArrowUp className="w-3 h-3" /> : sub.delta7d < 0 ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />;
        const deltaColor = sub.delta7d > 0 ? "text-success bg-success/10" : sub.delta7d < 0 ? "text-error bg-error/10" : "text-muted-foreground bg-muted";
        
        return (
          <div key={sub.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{sub.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">{sub.value}</span>
                <div className={cn("flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium", deltaColor)}>
                  {deltaIcon}
                  {sub.delta7d !== 0 && Math.abs(sub.delta7d)}
                </div>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all duration-700 ease-out rounded-full", scoreColor)}
                style={{ width: `${sub.value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
