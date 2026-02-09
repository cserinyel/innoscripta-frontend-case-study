import axiosInstance from "../../lib/axiosInstance";
import type { SearchParams, SourceService, SearchResult } from "../../lib/types";
import type { GnewsResponseDto } from "./types";
import { normalizeGnewsResponse } from "./normalizer";
import { mapCategoryToGnews } from "./categories";
import { DEFAULT_PAGE_SIZE } from "@/constants";

const API_KEY = import.meta.env.VITE_GNEWS_API_KEY as string;
const BASE_URL = import.meta.env.VITE_GNEWS_BASE_URL as string;

const buildRequestParams = (
  params: SearchParams,
): Record<string, string | number> => {
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

  const requestParams: Record<string, string | number> = {
    apikey: API_KEY,
    lang: "en",
    max: pageSize,
    page: (params.page ?? 0) + 1,
  };

  if (params.keyword) {
    requestParams.q = params.keyword;
  }

  const category = mapCategoryToGnews(params.category);
  if (category) {
    requestParams.category = category;
  }

  if (params.date) {
    requestParams.from = `${params.date}T00:00:00Z`;
    requestParams.to = `${params.date}T23:59:59Z`;
  }

  return requestParams;
};

const gnewsService: SourceService = {
  name: "GNews",

  getFetchKey: (params) => [params.keyword, params.category, params.date, params.page ?? 0],

  search: async (params: SearchParams): Promise<SearchResult> => {
    const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;

    const response = await axiosInstance.get<GnewsResponseDto>(
      `${BASE_URL}/top-headlines`,
      { params: buildRequestParams(params) },
    );

    const articles = normalizeGnewsResponse(
      response.data.articles ?? [],
      params.category,
    );

    return {
      articles,
      meta: {
        totalResults: response.data.totalArticles,
        pageSize,
      },
    };
  },
};

export default gnewsService;
