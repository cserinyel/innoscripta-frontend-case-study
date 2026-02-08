import axiosInstance from "../../lib/axiosInstance";
import type { SearchParams, SourceService, SearchResult, ApiError } from "../../lib/types";
import { getOldestDate } from "../../lib/utils";
import type { GuardianResponseDto } from "./types";
import { normalizeGuardianResponse } from "./normalizer";
import { mapCategoryToGuardianSections } from "./categories";

const API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY as string;
const BASE_URL = import.meta.env.VITE_GUARDIAN_BASE_URL as string;

const DEFAULT_PAGE_SIZE = 20;
const SHOW_FIELDS = "headline,trailText,byline,thumbnail";

const buildRequestParams = (
  params: SearchParams,
): Record<string, string | number> => {
  const requestParams: Record<string, string | number> = {
    "api-key": API_KEY,
    "page-size": params.pageSize ?? DEFAULT_PAGE_SIZE,
    page: (params.page ?? 0) + 1,
    "show-fields": SHOW_FIELDS,
    "order-by": "newest",
  };

  if (params.keyword) {
    requestParams.q = params.keyword;
  }

  const sections = mapCategoryToGuardianSections(params.category);
  if (sections) {
    requestParams.section = sections;
  }

  if (params.date) {
    requestParams["from-date"] = params.date;
    requestParams["to-date"] = params.date;
  }

  return requestParams;
};

const guardianService: SourceService = {
  name: "Guardian",

  getFetchKey: (params) => [params.keyword, params.category, params.date, params.page ?? 0],

  search: async (params: SearchParams): Promise<SearchResult> => {
    const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

    const response = await axiosInstance.get<GuardianResponseDto>(
      `${BASE_URL}/search`,
      { params: buildRequestParams(params) },
    );

    if (response.data.response.status !== "ok") {
      const apiError: ApiError = {
        message: response.data.response.message ?? "Guardian API returned an error",
        source: "Guardian",
      };
      throw apiError;
    }

    const articles = normalizeGuardianResponse(
      response.data.response.results,
      params.category,
    );

    return {
      articles,
      meta: {
        totalResults: response.data.response.total,
        oldestDate: getOldestDate(articles.map((a) => a.date)),
        pageSize,
      },
    };
  },
};

export default guardianService;
