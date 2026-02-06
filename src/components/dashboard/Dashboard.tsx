import { Search } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { FilterBar } from "@/components/layout/FilterBar";
import { NewsCard } from "@/components/news/news-card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { mockNews } from "@/data/mock-news";

const Dashboard = () => {
  return (
    <div className="bg-background min-h-screen">
      <Topbar />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <InputGroup>
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search articles..." />
        </InputGroup>

        <FilterBar />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockNews.map((article) => (
            <NewsCard key={article.id} {...article} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
