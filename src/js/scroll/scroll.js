import { MIN_OFFSET_FOR_SCROLL_TO_TOP_APEAR } from '../constants';
import { rootRefs } from '../root-refs';

export const onWindowScroll = () => {
  const sttClassList = rootRefs.scrollToTopButton.classList;

  if (window.scrollY >= MIN_OFFSET_FOR_SCROLL_TO_TOP_APEAR / 2) {
    rootRefs.headerContainer.classList.add('is-fixed');
  } else {
    rootRefs.headerContainer.classList.remove('is-fixed');
  }

  if (
    window.scrollY > MIN_OFFSET_FOR_SCROLL_TO_TOP_APEAR &&
    !sttClassList.contains('is-shown')
  ) {
    sttClassList.add('is-shown');

    return;
  }

  if (
    window.scrollY <= MIN_OFFSET_FOR_SCROLL_TO_TOP_APEAR &&
    sttClassList.contains('is-shown')
  ) {
    sttClassList.remove('is-shown');

    return;
  }
};
