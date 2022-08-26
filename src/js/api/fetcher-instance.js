import { Fetcher } from '.';
import { pageState } from '../state';
import { paginationRendering } from '../pagination-actions';
import { createMoviesMarkupArray } from '../movies-markup';
import { calculateMoviesPartialLoadPoints } from '../movies-markup';

export const moviesFetcher = new Fetcher();

const settings = {
  pageState,
  createMoviesMarkupArray,
  paginationRendering,
  calculateMoviesPartialLoadPoints,
};

moviesFetcher.init(settings);
