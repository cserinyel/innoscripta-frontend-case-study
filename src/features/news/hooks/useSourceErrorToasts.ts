import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ApiError } from "@/features/news/api/lib/types";

export const useSourceErrorToasts = (sourceErrors: ApiError[]): void => {
  const shownErrorsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const currentKeys = new Set<string>();

    sourceErrors.forEach((err) => {
      const key = `${err.source ?? "Source"}:${err.message}`;
      currentKeys.add(key);

      if (!shownErrorsRef.current.has(key)) {
        toast.error(`${err.source ?? "Source"}: ${err.message}`, {
          id: err.source,
        });
      }
    });

    shownErrorsRef.current = currentKeys;
  }, [sourceErrors]);
};
