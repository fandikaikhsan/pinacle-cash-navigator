import { Shield } from "lucide-react";

export const AuditFooter = () => {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
      <Shield className="w-3 h-3" />
      <span>Logged for audit • Human review available</span>
    </div>
  );
};
