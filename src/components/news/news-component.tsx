import { cn } from "@/lib/utils";
import React from "react";

interface NewsComponentProps {
  children: React.ReactNode;
}

const NewsComponent = ({ children }: NewsComponentProps): React.ReactNode => {
  return (
    <div className="bg-background w-full">
      <div
        data-slot="news-component-wrapper"
        className={cn(
          "mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2",
          "sm:gap-12 sm:p-6",
          "md:grid-cols-2 md:gap-8",
          "lg:p-12 2xl:max-w-6xl",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default NewsComponent;
