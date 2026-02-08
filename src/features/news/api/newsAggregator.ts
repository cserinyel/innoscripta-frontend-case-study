import type { SourceService } from "./lib/types";
import guardianService from "./sources/guardian/service";
import gnewsService from "./sources/gnews/service";

export const sourceRegistry: SourceService[] = [guardianService, gnewsService];
