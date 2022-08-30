import { pageState } from '../state';
import { moviesFetcher } from '../api';
import { pageState } from '../state';

const shiftCurrentPage = (isIncrementing = false, shiftTo = null) => {
  if (pageState.currentPage === 'home') {
    pageState.currentMoviePage = shiftTo
      ? shiftTo
      : isIncrementing
      ? pageState.currentMoviePage + 1
      : pageState.currentMoviePage - 1;
  }

  if (
    pageState.currentPage === 'library' &&
    pageState.currentLibrarySection === 'watched'
  ) {
    pageState.currentLibraryWatchedPage = shiftTo
      ? shiftTo
      : isIncrementing
      ? pageState.currentLibraryWatchedPage + 1
      : pageState.currentLibraryWatchedPage - 1;
  }

  if (
    pageState.currentPage === 'library' &&
    pageState.currentLibrarySection === 'queue'
  ) {
    pageState.currentLibraryQueuePage = shiftTo
      ? shiftTo
      : isIncrementing
      ? pageState.currentLibraryQueuePage + 1
      : pageState.currentLibraryQueuePage - 1;
  }
};

export const paginationAction = action => {
  if (action === 'prev') {
    shiftCurrentPage(false);
    moviesFetcher.reRenderMovies(true);

    return;
  }

  if (action === 'next') {
    shiftCurrentPage(true);
    moviesFetcher.reRenderMovies(true);

    return;
  }

  const parsedPage = parseInt(action);

  if (!parsedPage) return;

  shiftCurrentPage(true, parsedPage);
  moviesFetcher.reRenderMovies(true);
};
