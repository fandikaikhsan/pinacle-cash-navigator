import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ConsentToggleProps {
  source: string;
  purpose: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const ConsentToggle = ({ source, purpose, enabled, onChange }: ConsentToggleProps) => {
  return (
    <div className="flex items-center justify-between gap-4 py-3 px-4 bg-muted/50 rounded-lg">
      <div className="flex-1">
        <Label htmlFor={`consent-${source}`} className="font-medium text-foreground cursor-pointer">
          {source.charAt(0).toUpperCase() + source.slice(1)}
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5">{purpose}</p>
      </div>
      <Switch id={`consent-${source}`} checked={enabled} onCheckedChange={onChange} />
    </div>
  );
};
