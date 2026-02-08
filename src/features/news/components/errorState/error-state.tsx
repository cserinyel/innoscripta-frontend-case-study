import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}): React.ReactElement => (
  <div className="flex flex-col items-center justify-center gap-4 py-16">
    <AlertCircle className="text-destructive size-12" />
    <div className="text-center">
      <p className="text-lg font-medium">Something went wrong</p>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
    <Button variant="outline" onClick={onRetry}>
      Try again
    </Button>
  </div>
);

export default ErrorState;
