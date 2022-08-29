import { moviesFetcher } from '../api';
import { openModal } from './';
import { createTrailerModalMarkup } from './';

export const onTrailerClick = async target => {
  openModal(target);

  const trailersData = await moviesFetcher.fetchVideos(target.dataset.movie);

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
