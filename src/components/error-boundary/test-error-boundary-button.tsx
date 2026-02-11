import { Bug } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

const TestErrorBoundaryButton = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("Test error triggered from TestButton");
  }

  return (
    <Button
      variant="ghost"
      onClick={() => setShouldThrow((prev) => !prev)}
      aria-label="Trigger error (test Error Boundary)"
    >
      <Bug className="size-5" />
      Test Error Boundary
    </Button>
  );
};

export default TestErrorBoundaryButton;
