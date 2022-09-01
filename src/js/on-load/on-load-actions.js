import { pageState } from '../state';
import { moviesFetcher } from '../api';
import { rootRefs } from '../root-refs';
import { setGlobalLocale } from '../locale';
import { setPageMode } from '../page-mode';
import { onEscPress } from '../search';

export const loadContent = () => {
  setPageMode(pageState.mode);
  setGlobalLocale(pageState.locale);

  if (pageState.currentLibrarySection === 'queue')
    rootRefs.headerContainer.classList.add('in-queue');

  if (pageState.currentPage === 'home') {
    if (!pageState.currentQuery) {
      window.removeEventListener('keydown', onEscPress);
      rootRefs.searchField.value = '';

      moviesFetcher.renderTrending();

      return;
    }

    moviesFetcher.query = pageState.currentQuery;
    rootRefs.searchField.value = pageState.currentQuery;

    window.addEventListener('keydown', onEscPress);

    moviesFetcher.renderSearched(pageState.currentMoviePage);

    return;
  }

  if (pageState.currentPage === 'library') {
    rootRefs.headerContainer.classList.add('in-library');

    moviesFetcher.renderLibrary();
  }
};
