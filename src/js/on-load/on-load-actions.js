import { pageState } from '../state';
import { moviesFetcher } from '../api';
import { rootRefs } from '../root-refs';
import { onEscPress } from '../search';

export const onPageLoad = () => {
  if (pageState.currentPage === 'home') {
    if (!pageState.currentQuery) {
      moviesFetcher.renderTrending();

      return;
    }

    moviesFetcher.query = pageState.currentQuery;
    rootRefs.searchField.value = pageState.currentQuery;

    window.addEventListener('keydown', onEscPress);

    moviesFetcher.renderSearched(pageState.currentMoviePage);

    return;
  }
};
