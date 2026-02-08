import axiosInstance from "../../lib/axiosInstance";
import type { SearchParams, SourceService, SearchResult, ApiError } from "../../lib/types";
import type { NewsApiResponseDto } from "./types";
import { normalizeNewsApiResponse } from "./normalizer";

const API_KEY = import.meta.env.VITE_NEWSAPI_KEY as string;
const BASE_URL = import.meta.env.VITE_NEWSAPI_BASE_URL as string;

const DEFAULT_PAGE_SIZE = 20;

const buildRequestParams = (
  params: SearchParams,
): Record<string, string | number> => {
  const requestParams: Record<string, string | number> = {
    apiKey: API_KEY,
    pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
    page: (params.page ?? 0) + 1,
  };

  if (params.keyword) {
    requestParams.q = params.keyword;
  }

  if (params.category) {
    requestParams.category = params.category;
  }

  return requestParams;
};

const getOldestDate = (dates: string[]): string | null => {
  if (dates.length === 0) return null;
  return dates.reduce((oldest, d) => (d < oldest ? d : oldest));
};

const newsApiService: SourceService = {
  name: "NewsAPI",

  getFetchKey: (params) => [params.keyword, params.category, params.page ?? 0],

  search: async (params: SearchParams): Promise<SearchResult> => {
    const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

    const response = await axiosInstance.get<NewsApiResponseDto>(
      `${BASE_URL}/top-headlines`,
      { params: buildRequestParams(params) },
    );

    if (response.data.status === "error") {
      const apiError: ApiError = {
        message: response.data.message ?? "NewsAPI returned an error",
        source: "NewsAPI",
      };
      throw apiError;
    }

    const articles = normalizeNewsApiResponse(
      response.data.articles,
      params.category,
    );

    return {
      articles,
      meta: {
        totalResults: response.data.totalResults,
        oldestDate: getOldestDate(articles.map((a) => a.date)),
        pageSize,
      },
    };
  },
};

export default newsApiService;
