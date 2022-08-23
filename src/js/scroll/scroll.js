import { pageState } from '../state';

export const onWindowScroll = () => {
  pageState.yPosition = window.scrollY;
};
