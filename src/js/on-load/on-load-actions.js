import { pageState } from '../state';
import { moviesFetcher } from '../api';
import { rootRefs } from '../root-refs';
import { setGlobalLocale } from '../locale';
import { setPageMode } from '../page-mode';
import { onEscPress } from '../search';
import { initTeamModalSlider } from '../team-slider';

export const onPageLoad = () => {
  setPageMode(pageState.mode);
  setGlobalLocale(pageState.locale);

  initTeamModalSlider();

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

  if (pageState.currentPage === 'library') {
    rootRefs.headerContainer.classList.add('in-library');
  }
};
