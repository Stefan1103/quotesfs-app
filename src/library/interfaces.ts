export interface IQuote {
  _id: string;
  author: string;
  length: number;
  authorSlug: string;
  content: string;
  dateAdded: string;
  dateModified: string;
  tags: [];
}
export interface IQuotes {
  count: number;
  lastItemIndex: number;
  page: number;
  results: IQuote[];
  totalCount: number;
  totalPages: number;
}
