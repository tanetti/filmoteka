import { rootRefs } from '../root-refs';
import { pageState } from '../state';
import { loadContent } from '../on-load';

export const onLibraryClick = section => {
  if (section === 'watched') {
    if (
      pageState.currentLibraryWatchedPage === 1 &&
      pageState.currentLibrarySection === section
    )
      return;

    if (
      pageState.currentLibraryWatchedPage !== 1 &&
      pageState.currentLibrarySection === section
    )
      pageState.currentLibraryWatchedPage = 1;

    pageState.currentLibrarySection = section;
    rootRefs.headerContainer.classList.remove('in-queue');

    loadContent();

    return;
  }

  if (section === 'queue') {
    if (
      pageState.currentLibraryQueuePage === 1 &&
      pageState.currentLibrarySection === section
    )
      return;

    if (
      pageState.currentLibraryQueuePage !== 1 &&
      pageState.currentLibrarySection === section
    )
      pageState.currentLibraryQueuePage = 1;

    pageState.currentLibrarySection = section;
    rootRefs.headerContainer.classList.add('in-queue');

    loadContent();

    return;
  }
};
