import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusIndicatorVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-all duration-200",
  {
    variants: {
      status: {
        standby: "bg-standby text-standby-foreground animate-standby-pulse shadow-standby",
        go: "bg-go text-go-foreground shadow-go",
        waiting: "bg-muted text-muted-foreground",
        complete: "bg-operator-ready text-foreground",
        ready: "bg-operator-ready text-foreground",
        "not-ready": "bg-operator-not-ready text-foreground",
        emergency: "bg-emergency text-emergency-foreground animate-standby-pulse",
        warning: "bg-warning text-warning-foreground",
      },
      size: {
        sm: "h-2 w-2",
        md: "h-3 w-3",
        lg: "h-4 w-4",
        xl: "h-6 w-6",
      },
    },
    defaultVariants: {
      status: "waiting",
      size: "md",
    },
  }
);

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {}

const StatusIndicator = ({ className, status, size, ...props }: StatusIndicatorProps) => {
  return (
    <div
      className={cn(statusIndicatorVariants({ status, size }), className)}
      {...props}
    />
  );
};

export { StatusIndicator, statusIndicatorVariants };