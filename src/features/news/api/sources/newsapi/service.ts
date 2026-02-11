import axiosInstance from "../../lib/axiosInstance";
import type { SearchParams, SourceService, SearchResult, ApiError } from "../../lib/types";
import type { NewsApiResponseDto } from "./types";
import { normalizeNewsApiResponse } from "./normalizer";
import { mapCategoryToNewsApiSources, getAllNewsApiSources } from "./categories";
import { DEFAULT_PAGE_SIZE, MAX_PAGINATABLE_ARTICLES, SOURCE_NAMES } from "@/features/news/constants";
import { buildNewsFetchKey } from "../../lib/utils";

const API_KEY = import.meta.env.VITE_NEWSAPI_API_KEY as string;
const BASE_URL = import.meta.env.VITE_NEWSAPI_BASE_URL as string;

const buildRequestParams = (
  params: SearchParams,
): Record<string, string | number> => {
  const requestParams: Record<string, string | number> = {
    apiKey: API_KEY,
    pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
    page: (params.page ?? 0) + 1,
    sortBy: "publishedAt",
  };

  if (params.keyword) {
    requestParams.q = params.keyword;
  }

  const sources = mapCategoryToNewsApiSources(params.category);
  if (sources) {
    requestParams.sources = sources;
  } else {
    // No category selected – include all known sources so results are
    // scoped to our curated list regardless of whether a keyword is present.
    requestParams.sources = getAllNewsApiSources();
  }

  if (params.dateFrom) {
    requestParams.from = `${params.dateFrom}T00:00:00Z`;
  }
  if (params.dateTo) {
    requestParams.to = `${params.dateTo}T23:59:59Z`;
  }

  return requestParams;
};

const newsApiService: SourceService = {
  name: SOURCE_NAMES.newsapi,

  getFetchKey: (params) => buildNewsFetchKey(params),

  search: async (params: SearchParams): Promise<SearchResult> => {
    const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

    const response = await axiosInstance.get<NewsApiResponseDto>(
      `${BASE_URL}/everything`,
      { params: buildRequestParams(params) },
    );

    if (response.data.status !== "ok") {
      const apiError: ApiError = {
        message: response.data.message ?? "NewsAPI returned an error",
        source: "NewsAPI",
      };
      throw apiError;
    }

    const articles = normalizeNewsApiResponse(
      response.data.articles ?? [],
      params.category,
    );

    return {
      articles,
      meta: {
        totalResults: Math.min(response.data.totalResults, MAX_PAGINATABLE_ARTICLES),
        pageSize,
      },
    };
  },
};

export default newsApiService;
