import type { SourceService } from "./lib/types";
import guardianService from "./sources/guardian/service";
import nytService from "./sources/nyt/service";
import newsApiService from "./sources/newsapi/service";

export const sourceRegistry: SourceService[] = [guardianService, nytService, newsApiService];
