export interface GuardianFieldsDto {
  headline?: string;
  trailText?: string;
  byline?: string;
  thumbnail?: string;
}

export interface GuardianResultDto {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: GuardianFieldsDto;
  isHosted: boolean;
  pillarId?: string;
  pillarName?: string;
}

export interface GuardianResponseDto {
  response: {
    status: string;
    userTier?: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    orderBy?: string;
    results: GuardianResultDto[] | null;
    message?: string;
  };
}
