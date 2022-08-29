import { moviesFetcher } from '../api';
import { openModal } from './';
import { createTrailerModalMarkup } from './';

export const onTrailerClick = async target => {
  openModal(target);

  const trailersData = await moviesFetcher.fetchVideos(target.dataset.movie);

  if (trailersData === 'error') {
    document.querySelector('.trailer-modal__farame-container').innerHTML =
      '<div class="trailer-modal__error"><svg class="trailer-modal__error-icon" xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 16 16"><path d="M15.04 12.512 8.944 2.304c-.432-.72-1.472-.784-1.92-.08L.977 12.496c-.48.752.064 1.905.959 1.905h12.128c.88 0 1.424-1.136.976-1.888zm-7.072.16a.785.785 0 1 1 .001-1.57.785.785 0 0 1-.001 1.57zm.832-2.88c0 .432-.368.784-.8.784s-.8-.351-.8-.784V5.695c0-.432.368-.784.8-.784s.8.351.8.784v4.097z"/></svg></div>';
    return;
  }

  let mainVideo = null;
  const playList = [];

  if (trailersData.length === 0) {
    mainVideo = '2U76x2fD_tE';
  } else {
    for (const trailer of trailersData) {
      if (!mainVideo) {
        mainVideo = trailer.key;
        continue;
      }

      const name = trailer.name.toLowerCase();

      if (name.includes('official') || name.includes('офіційний')) {
        if (mainVideo) playList.push(mainVideo);

        mainVideo = trailer.key;
        continue;
      }

      playList.push(trailer.key);
    }
  }

  document.querySelector('.trailer-modal__farame-container').innerHTML =
    createTrailerModalMarkup(mainVideo, playList);
  document
    .querySelector('.trailer-modal__farame')
    .classList.remove('is-hidden');
};
