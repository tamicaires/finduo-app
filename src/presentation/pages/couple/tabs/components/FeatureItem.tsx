import { MdCheckCircle, MdCancel } from "react-icons/md";
import { Badge } from "@/presentation/components/ui/badge";
import { cn } from "@/shared/utils";

interface FeatureItemProps {
  label: string;
  description: string;
  enabled: boolean;
}

export function FeatureItem({ label, description, enabled }: FeatureItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border transition-colors",
        enabled
          ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
          : "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"
      )}
    >
      <div className="mt-0.5">
        {enabled ? (
          <MdCheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
        ) : (
          <MdCancel className="h-5 w-5 text-gray-400 dark:text-gray-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              enabled ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {label}
          </span>
          {!enabled && (
            <Badge variant="secondary" className="text-xs">
              Desabilitado
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}
