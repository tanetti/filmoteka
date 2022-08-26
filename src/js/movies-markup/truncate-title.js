import { DESKTOP_MIN_WIDTH } from '../constants';

export const truncateTitle = title => {
  let allovedTitleLength = 45;

  if (window.innerWidth >= DESKTOP_MIN_WIDTH) allovedTitleLength = 34;

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
