import { moviesFetcher } from '../api';
import { pageState } from '../state';
import { TABLET_MIN_WIDTH, DESKTOP_MIN_WIDTH } from '../constants';

const getWindowCase = width => {
  if (width < TABLET_MIN_WIDTH) return 'mobile';
  if (width > TABLET_MIN_WIDTH && width < DESKTOP_MIN_WIDTH) return 'tablet';
  if (width > DESKTOP_MIN_WIDTH) return 'desktop';
};

export const onWindowResize = () => {
  const prevWidth = pageState.windowWidth;
  const currWidth = window.innerWidth;

  const prevCase = getWindowCase(prevWidth);
  const currCase = getWindowCase(currWidth);

  if (prevCase !== currCase) moviesFetcher.reRenderMoviesByResizing();

  pageState.windowWidth = currWidth;
};
