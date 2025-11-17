import { Loader2 } from "lucide-react";

interface LoadingAnimationProps {
  text?: string;
  fullScreen?: boolean;
}

export const LoadingAnimation = ({ text = "Loading...", fullScreen = false }: LoadingAnimationProps) => {
  const containerClass = fullScreen
    ? "fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
    : "relative";

  return (
    <div className={`${containerClass} flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-glow rounded-full" />
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-foreground">{text}</p>
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="w-full p-6 rounded-xl border border-border bg-card animate-fade-in">
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:1000px_100%]" />
        <div className="h-4 bg-muted rounded w-3/4 animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:1000px_100%]" />
        <div className="h-4 bg-muted rounded w-1/2 animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:1000px_100%]" />
      </div>
    </div>
  );
};
