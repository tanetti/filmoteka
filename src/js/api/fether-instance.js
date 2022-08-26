import { Fetcher } from './';
import { paginationRendering } from '../pagination-actions';

export const moviesFetcher = new Fetcher();

const settings = {
  paginationRendering,
};

moviesFetcher.init(settings);
