import { Provider } from "react-redux";
import { store } from "@/app/store";
import Topbar from "@/components/layout/Topbar";
import FilterBar from "@/components/layout/FilterBar";
import SearchInput from "./components/shared/searchInput/search-input";

const App = (): React.ReactElement => {
  return (
    <Provider store={store}>
      <div className="bg-background min-h-screen">
        <Topbar />
        <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <SearchInput />
          <FilterBar />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* News cards will be populated once API integration is complete */}
          </div>
        </main>
      </div>
    </Provider>
  );
};

export default App;
