import { Fetcher } from '.';
import { pageState } from '../state';
import { localeDB } from '../locale';
import { paginationRendering } from '../pagination-actions';
import { errorRendering } from '../error';
import { createMoviesMarkupArray } from '../movies-markup';
import { calculateMoviesPartialLoadPoints } from '../movies-markup';
import * as noImage from '../../images/no-image.png';

export const moviesFetcher = new Fetcher();

const settings = {
  pageState,
  localeDB,
  createMoviesMarkupArray,
  paginationRendering,
  errorRendering,
  noImage,
  calculateMoviesPartialLoadPoints,
};

moviesFetcher.init(settings);
