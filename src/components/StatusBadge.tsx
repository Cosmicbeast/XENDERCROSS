import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "minor" | "major" | "critical" | "operational" | "maintenance";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    minor: "bg-warning text-warning-foreground",
    major: "bg-destructive text-destructive-foreground",
    critical: "bg-critical text-critical-foreground animate-pulse",
    operational: "bg-success text-success-foreground",
    maintenance: "bg-secondary text-secondary-foreground",
  };

  const labels = {
    minor: "Minor",
    major: "Major", 
    critical: "Critical",
    operational: "Operational",
    maintenance: "Maintenance",
  };

  return (
    <Badge
      className={cn(
        "font-medium",
        variants[status],
        className
      )}
    >
      {labels[status]}
    </Badge>
  );
}