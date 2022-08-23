import { pageState } from '../state';
import { toggleScrollToTopButtonApearence } from './';

export const onWindowScroll = () => {
  pageState.yPosition = window.scrollY;

  toggleScrollToTopButtonApearence();
};
