import { rootRefs } from '../root-refs';
import { pageState } from '../state';

export const onNavigationClick = page => {
  if (pageState.currentPage === page) return;

  if (page === 'home') {
    pageState.currentPage = 'home';

    rootRefs.headerContainer.classList.remove('in-library');

    return;
  }

  if (page === 'library') {
    pageState.currentPage = 'library';

    rootRefs.headerContainer.classList.add('in-library');

    return;
  }
};
