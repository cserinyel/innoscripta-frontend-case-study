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
├── config/
│   └── env.ts                    # Environment variable validation & typed exports
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

### Centralized Environment Configuration

All `VITE_*` environment variables are validated and exported from a single `src/config/env.ts` module. The three source services import their keys from `env.guardian`, `env.nyt`, and `env.newsapi` rather than reading `import.meta.env` directly.

**Why:** If a required variable is missing, the app fails fast at startup with a clear error message listing exactly which variables are missing, rather than silently producing `undefined` API keys that cause cryptic 401 errors at runtime. The typed exports also provide IDE autocomplete.

---

## Adding a New News Source

1. Create a directory: `src/features/news/api/sources/<name>/`
2. Add four files following the existing pattern:
   - `types.ts` -- TypeScript interfaces for the raw API response DTO.
   - `categories.ts` -- a function that maps the app's `CategoryType` to the source's own section/desk identifiers.
   - `normalizer.ts` -- a function that converts the DTO array into `NewsArticle[]`.
   - `service.ts` -- implements `SourceService` (`name`, `search`, `getFetchKey`).
3. Add the source's env vars to `src/config/env.ts` and `.env.example`.
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
