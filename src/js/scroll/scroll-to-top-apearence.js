import { MIN_OFFSET_FOR_SCROLL_TO_TOP_APEAR } from '../constants';
import { rootRefs } from '../root-refs';

export const toggleScrollToTopButtonApearence = () => {
  const sttClassList = rootRefs.scrollToTopButton.classList;
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
