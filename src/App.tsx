import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/app/store";
import { queryClient } from "@/lib/queryClient";
import Topbar from "@/components/layout/Topbar";
import NewsContent from "@/features/news/components/newsContent/news-content";
import { Toaster } from "@/components/ui/sonner";

const App = (): React.ReactElement => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <div className="bg-background min-h-screen">
        <Topbar />
        <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <NewsContent />
        </main>
        <Toaster />
      </div>
    </QueryClientProvider>
  </Provider>
);

export default App;
