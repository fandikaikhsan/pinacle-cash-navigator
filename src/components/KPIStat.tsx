import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPIStatProps {
  label: string;
  value: string | number;
  delta?: number | string;
  trend?: "up" | "down" | "neutral";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const KPIStat = ({ label, value, delta, trend, size = "md", className }: KPIStatProps) => {
  const sizeStyles = {
    sm: { value: "text-xl", label: "text-xs", delta: "text-xs" },
    md: { value: "text-2xl", label: "text-sm", delta: "text-sm" },
    lg: { value: "text-4xl", label: "text-base", delta: "text-base" },
  };
  
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-muted-foreground";
  
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className={cn("text-muted-foreground font-medium", sizeStyles[size].label)}>{label}</p>
      <div className="flex items-baseline gap-2">
        <p className={cn("font-bold text-foreground", sizeStyles[size].value)}>{value}</p>
        {delta !== undefined && (
          <span className={cn("flex items-center gap-0.5 font-medium", trendColor, sizeStyles[size].delta)}>
            {trend === "up" && <ArrowUp className="w-3 h-3" />}
            {trend === "down" && <ArrowDown className="w-3 h-3" />}
            {delta}
          </span>
        )}
      </div>
    </div>
  );
};
