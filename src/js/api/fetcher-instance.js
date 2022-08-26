import { Fetcher } from '.';
import { pageState } from '../state';
import { paginationRendering } from '../pagination-actions';
import { createMoviesMarkupArray } from '../movies-markup';

export const moviesFetcher = new Fetcher();

const settings = {
  pageState,
  createMoviesMarkupArray,
  paginationRendering,
};

moviesFetcher.init(settings);
