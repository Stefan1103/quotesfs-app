export interface Quote {
  _id: string;
  author: string;
  length: number;
  authorSlug: string;
  content: string;
  dateAdded: string;
  dateModified: string;
  tags: [];
}
export interface QuotesList {
  count: number;
  lastItemIndex: number;
  page: number;
  results: Quote[];
  totalCount: number;
  totalPages: number;
}
export interface Age {
  age: number;
  count: number;
  name: string;
}

export interface err {
  error: boolean;
  status: null | string | number;
  statusText: string;
}

export interface RandomQuote {
  results: Quote[];
}
