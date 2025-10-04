import { ArrowUp, ArrowDown } from "lucide-react";

interface HeaderSummaryProps {
  inAmount: number;
  outAmount: number;
  inTrend?: "up" | "down";
  outTrend?: "up" | "down";
}

export const HeaderSummary = ({ inAmount, outAmount, inTrend = "up", outTrend = "down" }: HeaderSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="gradient-primary text-white px-6 py-6 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-success">
              <ArrowUp className="w-5 h-5" strokeWidth={3} />
              <span className="text-sm font-medium uppercase tracking-wide">IN</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{formatCurrency(inAmount)}</span>
              {inTrend === "up" && <ArrowUp className="w-4 h-4 text-success" />}
              {inTrend === "down" && <ArrowDown className="w-4 h-4 text-error" />}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-error">
              <ArrowDown className="w-5 h-5" strokeWidth={3} />
              <span className="text-sm font-medium uppercase tracking-wide">OUT</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{formatCurrency(outAmount)}</span>
              {outTrend === "up" && <ArrowUp className="w-4 h-4 text-error" />}
              {outTrend === "down" && <ArrowDown className="w-4 h-4 text-success" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
