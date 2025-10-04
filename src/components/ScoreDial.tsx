import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreDialProps {
  score: number;
  delta?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export const ScoreDial = ({ score, delta, size = "lg", label = "Financial Wellness Score" }: ScoreDialProps) => {
  const sizeStyles = {
    sm: { container: "w-24 h-24", text: "text-xl", label: "text-xs", stroke: 6 },
    md: { container: "w-32 h-32", text: "text-2xl", label: "text-sm", stroke: 8 },
    lg: { container: "w-40 h-40", text: "text-4xl", label: "text-base", stroke: 10 },
  };

  const radius = size === "sm" ? 38 : size === "md" ? 54 : 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  
  const scoreColor = score >= 70 ? "text-success" : score >= 40 ? "text-primary" : "text-error";
  const strokeColor = score >= 70 ? "stroke-success" : score >= 40 ? "stroke-primary" : "stroke-error";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn("relative", sizeStyles[size].container)}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className="stroke-muted"
            strokeWidth={sizeStyles[size].stroke}
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className={cn(strokeColor, "transition-all duration-1000 ease-out")}
            strokeWidth={sizeStyles[size].stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", scoreColor, sizeStyles[size].text)}>{score}</span>
          {delta !== undefined && (
            <span className={cn("flex items-center gap-0.5 font-medium", delta >= 0 ? "text-success" : "text-error", "text-sm")}>
              {delta >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(delta)}
            </span>
          )}
        </div>
      </div>
      <p className={cn("text-center text-muted-foreground font-medium", sizeStyles[size].label)}>{label}</p>
    </div>
  );
};
