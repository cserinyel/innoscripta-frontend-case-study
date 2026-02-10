# NewsHub

A modern news aggregator that pulls articles from multiple sources into a single, filterable interface. Built with React 19, TypeScript, and Vite.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
  - [Directory Structure](#directory-structure)
  - [Data Flow](#data-flow)
- [Design Choices and Rationale](#design-choices-and-rationale)
  - [Feature-Based Project Structure](#feature-based-project-structure)
  - [Dual State Management Strategy](#dual-state-management-strategy)
  - [Source Service Pattern](#source-service-pattern)
  - [Normalizer Pattern](#normalizer-pattern)
  - [Client-Side Preference Filtering](#client-side-preference-filtering)
  - [Parallel Multi-Source Fetching](#parallel-multi-source-fetching)
  - [Axios over Fetch](#axios-over-fetch)
  - [shadcn/ui for Primitives](#shadcnui-for-primitives)
  - [Centralized Environment Configuration](#centralized-environment-configuration)
- [Adding a New News Source](#adding-a-new-news-source)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
- [Docker](#docker)
  - [Using Docker Compose (recommended)](#using-docker-compose-recommended)
  - [Using Docker Directly](#using-docker-directly)
- [Scripts](#scripts)
- [Testing](#testing)

---

## Features

- **Multi-source aggregation** -- searches The Guardian, The New York Times, and NewsAPI simultaneously and merges results into a unified feed.
- **Keyword search** -- full-text search across all enabled sources.
- **Category filtering** -- filter by Business, Entertainment, General, Health, Science, Sports, or Technology. Each source maps these app-level categories to its own internal section/desk taxonomy.
- **Source selection** -- choose which sources to query, both per-search (via the filter bar) and as a persistent preference.
- **Date range filtering** -- restrict results to a custom date window.
- **User preferences** -- a slide-out panel to toggle preferred categories and sources, and to exclude specific writers by name. Preferences persist in `localStorage`.
- **Dark/light theme** -- toggle between themes; the choice is saved alongside other preferences.
- **Pagination** -- page through results with smart ellipsis navigation. Each source reports its total count; the aggregator uses the largest to drive the shared page control.
- **Error resilience** -- if one source fails, the others still display. Per-source errors appear as toasts so the user knows what degraded.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 19.2 |
| Language | TypeScript | 5.9 |
| Build Tool | Vite | 7.2 |
| Styling | Tailwind CSS | 4.1 |
| UI Primitives | shadcn/ui (Radix) | latest |
| Client State | Redux Toolkit | 2.11 |
| Server State | TanStack React Query | 5.90 |
| HTTP Client | Axios | 1.13 |
| Date Utilities | date-fns | 4.1 |
| Package Manager | pnpm | latest |

---

## Architecture

### Directory Structure

```
src/
├── app/                          # Redux store setup & typed hooks
│   ├── store.ts                  # configureStore with preferences reducer
│   └── hooks.ts                  # useAppDispatch / useAppSelector
├── components/
│   ├── layout/                   # Page-level layout components
│   │   ├── Topbar.tsx            # App header, theme toggle, preferences button
│   │   └── FilterBar.tsx         # Source/category/date filter controls
│   ├── shared/                   # Reusable generic components
│   │   ├── searchInput/          # Keyword search input
│   │   ├── filterInput/          # Generic input with icon & clear
│   │   ├── datePicker/           # Date range picker (react-day-picker)
│   │   ├── multiSelectCombobox/  # Multi-select dropdown
│   │   ├── singleSelectCombobox/ # Single-select dropdown
│   │   ├── pagination/           # Page navigation with ellipsis
│   │   ├── loadingSkeleton/      # Skeleton card grid
│   │   ├── emptyState/           # No-results messaging
│   │   ├── errorState/           # Error display with retry
│   │   └── toggleItem/           # Toggle button for preferences
│   └── ui/                       # shadcn/ui primitives (auto-generated)
├── features/
│   ├── news/
│   │   ├── api/
│   │   │   ├── hooks/
│   │   │   │   ├── useNewsSearch.ts       # Orchestrates parallel queries
│   │   │   │   └── useFilteredArticles.ts # Applies preference filters
│   │   │   ├── lib/
│   │   │   │   ├── axiosInstance.ts        # Shared Axios instance
│   │   │   │   ├── types.ts               # SearchParams, SourceService, etc.
│   │   │   │   └── utils.ts               # ID generation, error helpers
│   │   │   ├── newsAggregator.ts          # Source registry array
│   │   │   └── sources/
│   │   │       ├── guardian/              # Guardian API adapter
│   │   │       ├── nyt/                   # NYT Article Search adapter
│   │   │       └── newsapi/               # NewsAPI adapter
│   │   ├── components/
│   │   │   ├── newsCard/                  # Article card component
│   │   │   └── newsContent/               # Main content orchestrator
│   │   ├── constants/                     # Categories, sources, page size
│   │   ├── lib/                           # Filtering logic, date utils
│   │   └── types/                         # NewsArticle, SourceType, CategoryType
│   └── preferences/
│       ├── components/
│       │   ├── PreferencesPanel.tsx        # Slide-out sheet
│       │   ├── addWriterDialog/           # Dialog to add excluded writer
│       │   └── excludedWritersList/       # Searchable excluded-writers list
│       ├── constants/                     # localStorage key
│       ├── hooks/                         # useTheme
│       ├── lib/                           # localStorage read/write
│       ├── store/                         # Redux slice
│       └── types/                         # PreferencesState, Theme
└── lib/
    ├── queryClient.ts                     # React Query configuration
    └── utils.ts                           # cn() class-name helper
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                           App.tsx                               │
│  ┌─────────────────┐  ┌──────────────────────────────────────┐  │
│  │  Redux Provider  │  │  React Query Provider                │  │
│  └────────┬────────┘  └──────────────────┬───────────────────┘  │
│           │                              │                      │
│  ┌────────▼────────┐            ┌────────▼─────────┐            │
│  │  Preferences    │            │  NewsContent      │            │
│  │  Slice          │            │  (orchestrator)   │            │
│  │  (localStorage) │◄───────────┤                   │            │
│  └─────────────────┘  reads     │  useNewsSearch()  │            │
│                       prefs     │       │           │            │
│                                 │       ▼           │            │
│                          ┌──────┴───────────────┐   │            │
│                          │  sourceRegistry      │   │            │
│                          │  (newsAggregator)    │   │            │
│                          └──┬───────┬───────┬───┘   │            │
│                             │       │       │       │            │
│                     ┌───────▼┐  ┌───▼───┐ ┌─▼─────┐│            │
│                     │Guardian│  │  NYT  │ │NewsAPI││            │
│                     │Service │  │Service│ │Service││            │
│                     └───┬────┘  └───┬───┘ └───┬───┘│            │
│                         │           │         │    │            │
│                    normalize    normalize  normalize│            │
│                         │           │         │    │            │
│                         └─────┬─────┘─────────┘    │            │
│                               ▼                    │            │
│                      Unified NewsArticle[]         │            │
│                               │                    │            │
│                    ┌──────────▼──────────┐         │            │
│                    │ useFilteredArticles │         │            │
│                    │ (applies prefs)     │         │            │
│                    └──────────┬──────────┘         │            │
│                               ▼                    │            │
│                         Rendered cards             │            │
│                                                    │            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Design Choices and Rationale

### DRY, KISS, and SOLID in Practice

This project is intentionally structured to follow **DRY**, **KISS**, and **SOLID** principles. This section highlights how those principles show up concretely in the codebase.

#### DRY — Don't Repeat Yourself

- **Centralized filtering logic** — `filterArticles` in `src/features/news/lib/filters.ts` encapsulates all article filtering rules (sources, categories, excluded writers) so components and hooks don't reimplement them:

```ts
export const filterArticles = (
  articles: NewsArticle[],
  params: ArticleFilterParams,
): NewsArticle[] => {
  const allowedSourceNames: Set<string> = new Set(
    params.selectedSources.map((id) => SOURCE_NAMES[id]),
  );

  return articles.filter((a) => {
    if (!allowedSourceNames.has(a.source)) return false;
    if (a.category && !params.selectedCategories.includes(a.category as never))
      return false;
    if (
      a.author &&
      params.excludedWriters.some((w) =>
        new RegExp(
          `\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        ).test(a.author!),
      )
    )
      return false;
    return true;
  });
};
```

The `useFilteredArticles` hook in `src/features/news/api/hooks/useFilteredArticles.ts` reuses this function instead of duplicating the logic:

```ts
export const useFilteredArticles = (
  articles: NewsArticle[],
): NewsArticle[] => {
  const excludedWriters = useAppSelector(selectExcludedWriters);
  const selectedSources = useAppSelector(selectSelectedSources);
  const selectedCategories = useAppSelector(selectSelectedCategories);

  return useMemo(
    () =>
      filterArticles(articles, {
        excludedWriters,
        selectedSources,
        selectedCategories,
      }),
    [articles, excludedWriters, selectedSources, selectedCategories],
  );
};
```

- **Single persistence path for preferences** — `preferencesSlice` in `src/features/preferences/store/preferencesSlice.ts` owns reading and writing preferences to `localStorage`. All reducers call `savePreferencesToStorage(state)` instead of scattering `localStorage` writes throughout the app:

```ts
const preferencesSlice = createSlice({
  name: "preferences",
  initialState: loadFromStorage,
  reducers: {
    toggleCategory(state, action: PayloadAction<Category>) {
      const idx = state.selectedCategories.indexOf(action.payload);
      if (idx === -1) {
        state.selectedCategories.push(action.payload);
      } else {
        state.selectedCategories.splice(idx, 1);
      }
      savePreferencesToStorage(state);
    },
    // ...other reducers also call savePreferencesToStorage(state)
  },
});
```

This avoids duplicating serialization, validation, and storage access logic in multiple components.

#### KISS — Keep It Simple, Stupid

- **UI components focus on composition, not business logic** — `NewsContent` in `src/features/news/components/newsContent/news-content.tsx` orchestrates hooks and components with simple, readable control flow:

```tsx
const renderContent = () => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (filteredArticles.length === 0) {
    if (sourceErrors.length > 0) {
      return (
        <ErrorState
          message={sourceErrors[0].message}
          onRetry={handleSearch}
        />
      );
    } else {
      return <EmptyState hasSearched={hasSearched} />;
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <NewsCard key={article.id} {...article} />
        ))}
      </div>
      <ArticlePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};
```

All data-fetching and filtering complexity lives in `useNewsSearch` and `useFilteredArticles`, so the component remains a clear description of UI states (loading, empty, error, results).

- **Simple, declarative preferences UI** — `PreferencesPanel` in `src/features/preferences/components/PreferencesPanel.tsx` renders categories and sources by mapping over constant arrays. Toggling is a straightforward call to Redux actions:

```tsx
{CATEGORIES.map((category: Category) => (
  <ToggleItem
    key={category}
    label={category}
    active={selectedCategories.includes(category)}
    onToggle={() => dispatch(toggleCategory(category))}
  />
))}

{SOURCES.map((source: Source) => (
  <ToggleItem
    key={source}
    label={SOURCE_NAMES[source]}
    active={selectedSources.includes(source)}
    onToggle={() => dispatch(toggleSource(source))}
  />
))}
```

No complex state machines or derived booleans live in the component; it simply reflects Redux state and dispatches minimal actions, keeping the UI logic easy to follow.

#### SOLID

- **Single Responsibility Principle (SRP)** — Each module does one thing:
  - `useNewsSearch` (in `src/features/news/api/hooks/useNewsSearch.ts`) is responsible only for orchestrating multi-source queries, aggregating results and errors, and managing pagination.
  - `useFilteredArticles` and `filterArticles` are responsible only for applying user preferences to a list of articles.
  - `NewsContent` is responsible only for wiring hooks to UI components and rendering states.

- **Open/Closed Principle (OCP)** — The source service pattern in `src/features/news/api/lib/types.ts` and `newsAggregator.ts` allows new news sources to be added without modifying existing logic:

```ts
export interface SourceService {
  name: string;
  search: (params: SearchParams) => Promise<SearchResult>;
  getFetchKey: (params: SearchParams) => unknown[];
}
```

`newsAggregator.ts` registers all implementations in `sourceRegistry`, and `useNewsSearch` simply iterates over that array:

```ts
const activeSources = useMemo(() => {
  if (!searchParams) return [];
  return searchParams.sources.length > 0
    ? sourceRegistry.filter((s) => searchParams.sources.includes(s.name))
    : sourceRegistry;
}, [searchParams]);
```

Adding a new source means implementing `SourceService` in `src/features/news/api/sources/<name>/service.ts` and registering it; the rest of the system remains unchanged.

- **Liskov Substitution Principle (LSP)** — Any implementation of `SourceService` can be used wherever the abstraction is expected. `useNewsSearch` treats all entries in `sourceRegistry` uniformly; it never branches on concrete source types:

```ts
activeSources.map((source) => ({
  queryKey: [source.name, ...source.getFetchKey(paginatedParams)],
  queryFn: (): Promise<SearchResult> => source.search(paginatedParams),
  placeholderData: keepPreviousData,
}))
```

Guardian, NYT, and NewsAPI services are interchangeable in this loop. Adding or removing a source does not require changes to `useNewsSearch` or `NewsContent`.

- **Interface Segregation Principle (ISP)** — Consumers depend only on the methods and data they use; interfaces stay small and focused:
  - **Selectors** — `preferencesSlice` exposes narrow selectors (`selectSelectedSources`, `selectSelectedCategories`, `selectExcludedWriters`, `selectTheme`). Components import only what they need (e.g. `useAppSelector(selectSelectedSources)` in `NewsContent`).
  - **Hooks** — `useNewsSearch` returns a purpose-built surface (`articles`, `sourceErrors`, `page`, `totalPages`, `search`, `setPage`, etc.) instead of exposing raw React Query state. `useFilteredArticles` exposes only articles in and filtered articles out, so callers don't depend on filter internals.
  - **UI primitives** — Components like `ToggleItem`, `SearchInput`, and `ArticlePagination` accept minimal props (`label`, `active`, `onToggle`; `value`, `onChange`, `onSearch`; `currentPage`, `totalPages`, `onPageChange`), so callers are not forced to pass or handle unrelated options.

- **Dependency Inversion Principle (DIP)** — High-level modules depend on abstractions, not concrete details:
  - **Features depend on hooks and selectors** — `NewsContent` depends on `useNewsSearch`, `useFilteredArticles`, and Redux selectors like `selectSelectedSources`. It does not import `axiosInstance`, API URLs, or `localStorage`. `PreferencesPanel` depends on `toggleCategory`, `toggleSource`, `clearPreferences`, and selectors, not on how preferences are persisted.
  - **Services depend on shared abstractions** — Source services use the shared `axiosInstance` and the typed contracts `SearchParams`, `SearchResult`, and `NewsArticle`. They do not depend on any UI or component layer.

These patterns keep modules easy to reason about, test, and extend as new requirements (additional sources, filters, or preference types) are added.

### Feature-Based Project Structure

The codebase groups files by **feature** (`news`, `preferences`) rather than by type (`components/`, `hooks/`, `services/`). Each feature owns its API layer, components, business logic, types, and state.

**Why:** As the app grows, adding or modifying a feature means working within a single directory. Cross-feature coupling is minimized, and the codebase scales without a monolithic `components/` folder that mixes unrelated concerns.

### Dual State Management Strategy

- **Redux Toolkit** manages **preferences** (selected categories, selected sources, excluded writers, theme). This state is persisted to `localStorage` on every change and restored on startup.
- **TanStack React Query** manages **server state** (news articles from APIs). It handles caching, deduplication, background refetching, stale-while-revalidate, and request lifecycle (loading, error, success).

**Why:** Preferences are local, synchronous, and need persistence -- a classic Redux use case. News articles are remote, asynchronous, and benefit from React Query's built-in cache invalidation and request deduplication. Using both avoids forcing one tool into the other's domain.

### Source Service Pattern

Each news API is encapsulated behind the `SourceService` interface:

```typescript
interface SourceService {
  name: string;
  search: (params: SearchParams) => Promise<SearchResult>;
  getFetchKey: (params: SearchParams) => unknown[];
}
```

All services are registered in a flat `sourceRegistry` array inside `newsAggregator.ts`. The `useNewsSearch` hook iterates over this registry and launches parallel queries via `useQueries`.

**Why:** This follows the **Open/Closed Principle** -- adding a fourth news source requires creating a new directory under `sources/`, implementing the interface, and registering it. No existing code is modified. The aggregator and UI are source-agnostic.

### Normalizer Pattern

Each source adapter has a `normalizer.ts` that maps the external API's DTO into the unified `NewsArticle` shape:

```typescript
interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  author?: string | null;
  source: string;
  category: string;
  date: string;
}
```

**Why:** External APIs return wildly different response shapes (The Guardian nests data under `response.results[].fields`, NYT uses `response.docs[].headline.main`, NewsAPI uses `articles[].title`). Normalizing at the boundary means all downstream code -- filtering, sorting, rendering -- works with a single predictable type. If an API changes its schema, only its normalizer needs updating.

### Client-Side Preference Filtering

The `useFilteredArticles` hook applies preference-based filters (excluded writers, selected sources, selected categories) **after** articles are fetched and aggregated. Filtering happens in a `useMemo` that recomputes only when articles or preferences change.

**Why:** Preference filters are inherently client-side concerns -- the external APIs don't understand our "excluded writers" or cross-source category model. Filtering in memory is instant and avoids refetching from three APIs when a user toggles a preference.

### Parallel Multi-Source Fetching

`useNewsSearch` uses React Query's `useQueries` to fire requests to all active sources simultaneously. Results are merged and sorted by date once all (or some) resolve.

**Why:** Sequential fetching would triple latency. Parallel fetching with independent error handling means one slow or failing source doesn't block the others. React Query's `keepPreviousData` placeholder prevents UI flicker during page transitions.

### Axios over Fetch

A shared `axiosInstance` is configured with a 15-second timeout, JSON headers, and a response interceptor that converts `AxiosError` into the app's `ApiError` type.

**Why:** Axios provides built-in timeout support, automatic JSON parsing, typed error interception, and request/response interceptors out of the box. The native `fetch` API requires manual timeout implementation (`AbortController`), manual `.json()` calls, and manual error status checking.

### shadcn/ui for Primitives

UI primitives (Button, Dialog, Sheet, ScrollArea, Calendar, Popover, etc.) come from [shadcn/ui](https://ui.shadcn.com/). These are installed as source files into `src/components/ui/`, not as an npm dependency.

**Why:** shadcn/ui provides accessible, composable, unstyled (Radix-based) primitives that are copy-pasted into the project. This means zero runtime overhead from a component library, full control over styles, and no version-lock to a third-party package's release cycle.

**Why:** If a required variable is missing, the app fails fast at startup with a clear error message listing exactly which variables are missing, rather than silently producing `undefined` API keys that cause cryptic 401 errors at runtime. The typed exports also provide IDE autocomplete.

---

## Adding a New News Source

1. Create a directory: `src/features/news/api/sources/<name>/`
2. Add four files following the existing pattern:
   - `types.ts` -- TypeScript interfaces for the raw API response DTO.
   - `categories.ts` -- a function that maps the app's `CategoryType` to the source's own section/desk identifiers.
   - `normalizer.ts` -- a function that converts the DTO array into `NewsArticle[]`.
   - `service.ts` -- implements `SourceService` (`name`, `search`, `getFetchKey`).
3. Add the source's env vars to `.env`.
4. Import and register the service in `src/features/news/api/newsAggregator.ts`:
   ```typescript
   import myService from "./sources/<name>/service";
   export const sourceRegistry: SourceService[] = [
     guardianService, nytService, newsApiService, myService,
   ];
   ```
5. Add the source identifier to `SOURCES` and `SOURCE_NAMES` in `src/features/news/constants/index.ts`.

No other files need to be modified.

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_GUARDIAN_API_KEY` | API key for [The Guardian Open Platform](https://open-platform.theguardian.com/) |
| `VITE_GUARDIAN_BASE_URL` | Guardian API base URL (default: `https://content.guardianapis.com`) |
| `VITE_NYT_API_KEY` | API key for [NYT Article Search API](https://developer.nytimes.com/) |
| `VITE_NYT_BASE_URL` | NYT API base URL (default: `https://api.nytimes.com/svc/search/v2`) |
| `VITE_NEWSAPI_API_KEY` | API key for [NewsAPI](https://newsapi.org/) |
| `VITE_NEWSAPI_BASE_URL` | NewsAPI base URL (default: `https://newsapi.org/v2`) |

All variables are **required**.

> **Note:** Vite bakes `VITE_*` variables into the JavaScript bundle at build time. They are not read at runtime.

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** (enable via `corepack enable`)

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd innoscripta-news-hub

# Copy environment template and fill in your API keys
cp .env.example .env

# Install dependencies
pnpm install

# Start the dev server (default: http://localhost:5173)
pnpm dev
```

---

## Docker

The app ships with a multi-stage Dockerfile:

1. **Build stage** -- Node 22 Alpine with pnpm. Installs dependencies, accepts `VITE_*` build args, and runs `pnpm build` to produce the optimized `dist/` bundle.
2. **Serve stage** -- nginx Alpine. Serves the static bundle with gzip compression, aggressive caching for hashed assets, and SPA fallback routing.

### Using Docker Compose (recommended)

Docker Compose reads your `.env` file automatically and passes values as build args:

```bash
# Make sure .env exists with your API keys
cp .env.example .env
# Edit .env with real keys

# Build and start
docker compose up --build

# The app is available at http://localhost:3000
```

To stop:

```bash
docker compose down
```

### Using Docker Directly

```bash
docker build \
  --build-arg VITE_GUARDIAN_API_KEY=your_key \
  --build-arg VITE_GUARDIAN_BASE_URL=https://content.guardianapis.com \
  --build-arg VITE_NYT_API_KEY=your_key \
  --build-arg VITE_NYT_BASE_URL=https://api.nytimes.com/svc/search/v2 \
  --build-arg VITE_NEWSAPI_API_KEY=your_key \
  --build-arg VITE_NEWSAPI_BASE_URL=https://newsapi.org/v2 \
  -t newshub .

docker run -p 3000:80 newshub
```

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | Type-check with `tsc` and build for production |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Run ESLint across the project |
| `pnpm test` | Run Vitest in watch mode |
| `pnpm test:run` | Run Vitest once (e.g. for CI) |

---

## Testing

Tests use **Vitest** with **jsdom** and **React Testing Library**. The `@/` path alias is shared with the app, and `src/test/setup.ts` imports `@testing-library/jest-dom` so matchers like `toBeInTheDocument` are available.

**Run tests**

- `pnpm test` — watch mode; re-runs on file changes.
- `pnpm test:run` — single run (useful for CI or pre-commit).

**What’s covered**

- **Unit tests** (colocated with source):
  - **News filters** (`src/features/news/lib/filters.test.ts`) — `filterArticles` by source, category, and excluded writers (word-boundary matching).
  - **Preferences slice** (`src/features/preferences/store/preferencesSlice.test.ts`) — reducers (toggle category/source, add/remove excluded writer, clear, theme) and `loadFromStorage` (valid/invalid JSON, invalid enums fallback to defaults).
  - **News API utils** (`src/features/news/api/lib/utils.test.ts`) — `generateArticleId`, `isApiError`, `getErrorMessage`, `getSourceToCategoryMap`, `getCategoryBySourceId`.
  - **Preferences storage** (`src/features/preferences/lib/utils.test.ts`) — `savePreferencesToStorage` writes the correct key and JSON to `localStorage`.
  - **Guardian normalizer** (`src/features/news/api/sources/guardian/normalizer.test.ts`) — mapping Guardian API DTOs to `NewsArticle` (id, title, source, category, optional fields).
- **Component test** (`src/components/shared/toggleItem/toggle-item.test.tsx`) — `ToggleItem` renders label/button and calls `onToggle` on click.

Test files use the `.test.ts` / `.test.tsx` naming convention and sit next to the modules they cover.
