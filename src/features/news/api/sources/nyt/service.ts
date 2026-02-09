import { addDays, format } from "date-fns";
import axiosInstance from "../../lib/axiosInstance";
import type { SearchParams, SourceService, SearchResult, ApiError } from "../../lib/types";
import type { NytResponseDto } from "./types";
import { normalizeNytResponse } from "./normalizer";
import { mapCategoryToNytFilter } from "./categories";

const API_KEY = import.meta.env.VITE_NYT_API_KEY as string;
const BASE_URL = import.meta.env.VITE_NYT_BASE_URL as string;

const NYT_PAGE_SIZE = 10;

/**
 * Converts an ISO date string ("2026-02-04") to YYYYMMDD format ("20260204").
 */
const toNytDate = (isoDate: string): string => isoDate.replaceAll("-", "");

/**
 * Returns the next day in YYYYMMDD format for the end_date parameter.
 */
const toNytNextDate = (isoDate: string): string => {
  const nextDay = addDays(new Date(isoDate), 1);
  return format(nextDay, "yyyyMMdd");
};

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

  if (params.date) {
    requestParams.begin_date = toNytDate(params.date);
    requestParams.end_date = toNytNextDate(params.date);
  }

  return requestParams;
};

const nytService: SourceService = {
  name: "New York Times",

  getFetchKey: (params) => [params.keyword, params.category, params.date, params.page ?? 0],

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
        totalResults: response.data.response.metadata.hits,
        pageSize: NYT_PAGE_SIZE,
      },
    };
  },
};

export default nytService;
