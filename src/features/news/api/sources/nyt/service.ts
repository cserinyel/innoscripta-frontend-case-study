import axiosInstance from "../../lib/axiosInstance";
import type { SearchParams, SourceService, SearchResult, ApiError } from "../../lib/types";
import type { NytResponseDto } from "./types";
import { normalizeNytResponse } from "./normalizer";
import { mapCategoryToNytFilter } from "./categories";
import { DEFAULT_PAGE_SIZE, MAX_PAGINATABLE_ARTICLES } from "@/features/news/constants";
import { buildNewsFetchKey } from "../../lib/utils";

const API_KEY = import.meta.env.VITE_NYT_API_KEY as string;
const BASE_URL = import.meta.env.VITE_NYT_BASE_URL as string;

const buildRequestParams = (
  params: SearchParams,
): Record<string, string | number> => {
  const requestParams: Record<string, string | number> = {
    "api-key": API_KEY,
    sort: "newest",
    page: params.page ?? 0,
  };

  if (params.keyword) {
    requestParams.q = params.keyword;
  }

  const fq = mapCategoryToNytFilter(params.category);
  if (fq) {
    requestParams.fq = fq;
  }

  if (params.dateFrom) {
    requestParams.begin_date = params.dateFrom.replaceAll("-", "");
  }
  if (params.dateTo) {
    requestParams.end_date = params.dateTo.replaceAll("-", "");
  }

  return requestParams;
};

const nytService: SourceService = {
      name: "New York Times",

  getFetchKey: (params) => buildNewsFetchKey(params),

  search: async (params: SearchParams): Promise<SearchResult> => {
    const response = await axiosInstance.get<NytResponseDto>(
      `${BASE_URL}/articlesearch.json`,
      { params: buildRequestParams(params) },
    );

    if (response.data.status !== "OK") {
      const apiError: ApiError = {
        message: "NYT API returned an error",
        source: "New York Times",
      };
      throw apiError;
    }

    const articles = normalizeNytResponse(
      response.data.response.docs ?? [],
      params.category,
    );

    return {
      articles,
      meta: {
        totalResults: Math.min(response.data.response.metadata.hits, MAX_PAGINATABLE_ARTICLES),
        pageSize: DEFAULT_PAGE_SIZE,
      },
    };
  },
};

export default nytService;
