import { pageState } from '../state';

export const createTrailerModalMarkup = (mainVideo, playList) =>
  `<iframe class="trailer-modal__farame is-hidden" type="text/html" width="560" height="315"
        src="https://www.youtube.com/embed/${mainVideo}?autoplay=1&origin=https://tanetti.github.io&hl=${
    pageState.locale === 'en' ? 'en' : 'uk'
  }&controls=2&rel=0${
    playList.length >= 1 ? `&playlist=${mainVideo},${playList.join(',')}` : ''
  }" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
  </iframe>`;
