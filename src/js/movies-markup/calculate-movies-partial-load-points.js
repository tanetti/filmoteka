import {
  TABLET_MIN_WIDTH,
  DESKTOP_MIN_WIDTH,
  MOBILE_MAX_MOVIES_RENDER,
  TABLET_MAX_MOVIES_RENDER,
  DESKTOP_MAX_MOVIES_RENDER,
  MOBILE_MOVIES_WAIT_TO_LOAD,
  TABLET_MOVIES_WAIT_TO_LOAD,
  DESKTOP_MOVIES_WAIT_TO_LOAD,
} from '../constants';

export const calculateMoviesPartialLoadPoints = (
  isReRender,
  observerIteration,
  moviesMarkupArray
) => {
  let start = null;
  let end = null;
  let needToLoad = null;

  if (window.innerWidth < TABLET_MIN_WIDTH) {
    needToLoad = MOBILE_MOVIES_WAIT_TO_LOAD;
    start = isReRender ? 0 : observerIteration * MOBILE_MAX_MOVIES_RENDER;
    end =
      observerIteration * MOBILE_MAX_MOVIES_RENDER + MOBILE_MAX_MOVIES_RENDER >=
      moviesMarkupArray.length
        ? moviesMarkupArray.length
        : observerIteration * MOBILE_MAX_MOVIES_RENDER +
          MOBILE_MAX_MOVIES_RENDER;
  }

  if (
    window.innerWidth < DESKTOP_MIN_WIDTH &&
    window.innerWidth >= TABLET_MIN_WIDTH
  ) {
    needToLoad = TABLET_MOVIES_WAIT_TO_LOAD;
    start = isReRender ? 0 : observerIteration * TABLET_MAX_MOVIES_RENDER;
    end =
      observerIteration * TABLET_MAX_MOVIES_RENDER + TABLET_MAX_MOVIES_RENDER >=
      moviesMarkupArray.length
        ? moviesMarkupArray.length
        : observerIteration * TABLET_MAX_MOVIES_RENDER +
          TABLET_MAX_MOVIES_RENDER;
  }

  if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
    needToLoad = DESKTOP_MOVIES_WAIT_TO_LOAD;
    start = isReRender ? 0 : observerIteration * DESKTOP_MAX_MOVIES_RENDER;
    end =
      observerIteration * DESKTOP_MAX_MOVIES_RENDER +
        DESKTOP_MAX_MOVIES_RENDER >=
      moviesMarkupArray.length
        ? moviesMarkupArray.length
        : observerIteration * DESKTOP_MAX_MOVIES_RENDER +
          DESKTOP_MAX_MOVIES_RENDER;
  }

  return {
    start,
    end,
    needToLoad,
  };
};
