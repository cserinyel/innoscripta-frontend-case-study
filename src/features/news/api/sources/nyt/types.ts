export interface NytHeadlineDto {
  main: string;
  kicker?: string;
  print_headline?: string;
}

export interface NytBylineDto {
  original: string;
}

export interface NytMultimediaImageDto {
  url: string;
  height: number;
  width: number;
}

export interface NytMultimediaDto {
  caption?: string;
  credit?: string;
  default?: NytMultimediaImageDto;
  thumbnail?: NytMultimediaImageDto;
}

export interface NytKeywordDto {
  name: string;
  value: string;
  rank: number;
}

export interface NytDocDto {
  _id: string;
  abstract: string;
  snippet: string;
  headline: NytHeadlineDto;
  byline?: NytBylineDto;
  multimedia?: NytMultimediaDto;
  keywords: NytKeywordDto[];
  pub_date: string;
  web_url: string;
  source: string;
  document_type: string;
  news_desk: string;
  section_name: string;
  subsection_name?: string;
  type_of_material: string;
  word_count: number;
  uri: string;
}

export interface NytMetadataDto {
  hits: number;
  offset: number;
  time: number;
}

export interface NytResponseDto {
  status: string;
  copyright: string;
  response: {
    docs: NytDocDto[] | null;
    metadata: NytMetadataDto;
  };
}
