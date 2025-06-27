import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

const badgeVariants = {
  default: "inline-flex items-center rounded-full border border-transparent bg-primary px-3 py-1 text-xs font-medium text-primary-foreground",
  secondary: "inline-flex items-center rounded-full border border-transparent bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground",
  destructive: "inline-flex items-center rounded-full border border-transparent bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground",
  outline: "inline-flex items-center rounded-full border border-input bg-background px-3 py-1 text-xs font-medium text-foreground",
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants[variant], className)}
      {...props}
    />
  )
)
Badge.displayName = "Badge"

export { Badge } 