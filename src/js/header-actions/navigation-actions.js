import { rootRefs } from '../root-refs';
import { pageState } from '../state';
import { loadContent } from '../on-load';

export const onNavigationClick = page => {
  if (
    pageState.currentPage === page ||
    (pageState.currentPage === 'home' &&
      page === 'homeBlank' &&
      !pageState.currentQuery &&
      pageState.currentMoviePage === 1)
  )
    return;

  if (page === 'homeBlank') {
    pageState.currentPage = 'home';
    pageState.currentMoviePage = 1;
    pageState.currentQuery = null;

    rootRefs.searchField.value = '';
    rootRefs.headerContainer.classList.remove('in-library');

    loadContent();

    return;
  }

  if (page === 'home') {
    pageState.currentPage = 'home';

    rootRefs.headerContainer.classList.remove('in-library');

    loadContent();

    return;
  }

  if (page === 'library') {
    pageState.currentPage = 'library';

    rootRefs.headerContainer.classList.add('in-library');

    loadContent();

    return;
  }
};
