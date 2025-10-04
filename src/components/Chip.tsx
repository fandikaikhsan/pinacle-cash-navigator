import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "info";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
}

export const Chip = ({ children, variant = "default", size = "sm", className, onClick }: ChipProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-smooth";
  
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };
  
  const variantStyles = {
    default: "bg-muted text-muted-foreground",
    success: "bg-success/10 text-success",
    error: "bg-error/10 text-error",
    warning: "bg-primary/10 text-primary",
    info: "bg-accent/10 text-accent",
  };
  
  const Component = onClick ? "button" : "span";
  
  return (
    <Component 
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className, onClick && "cursor-pointer")} 
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      {children}
    </Component>
  );
};
