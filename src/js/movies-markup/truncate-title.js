import {
  TABLET_MIN_WIDTH,
  DESKTOP_MIN_WIDTH,
  MOBILE_MAX_TITLE_LENGTH,
  TABLET_MAX_TITLE_LENGTH,
  DESKTOP_MAX_TITLE_LENGTH,
} from '../constants';

export const truncateTitle = title => {
  let allovedTitleLength = MOBILE_MAX_TITLE_LENGTH;

  if (
    window.innerWidth >= TABLET_MIN_WIDTH &&
    window.innerWidth < DESKTOP_MIN_WIDTH
  )
    allovedTitleLength = TABLET_MAX_TITLE_LENGTH;
  if (window.innerWidth >= DESKTOP_MIN_WIDTH)
    allovedTitleLength = DESKTOP_MAX_TITLE_LENGTH;

  let truncatedTitleArr = [];

  for (const word of title.split(' ')) {
    if (
      truncatedTitleArr.join(' ').length + word.length + 1 >=
      allovedTitleLength
    ) {
      truncatedTitleArr.push('...');
      break;
    }

    truncatedTitleArr.push(word);
  }

  return truncatedTitleArr.join(' ');
};
