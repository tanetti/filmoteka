import { moviesFetcher } from '../api';
import { pageState } from '../state';
import { openModal } from './';

export const onTrailerClick = async target => {
  openModal(target);

  const trailersData = await moviesFetcher.fetchVideos(target.dataset.movie);

  let key = null;

  if (trailersData.length === 0) {
    key = '2U76x2fD_tE';
  } else {
    key = trailersData[0].key;
  }

  for (const trailer of trailersData) {
    const name = trailer.name.toLowerCase();

    if (name.includes('official') || name.includes('офіційний')) {
      key = trailer.key;
      break;
    }
  }

  const markup = `<iframe class="trailer-modal__farame is-hidden" type="text/html" width="560" height="315" src="https://www.youtube.com/embed/${key}" frameborder="0" showinfo="0" hl="${
    pageState.locale === 'en' ? 'en' : 'uk'
  }" controls="2" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

  document.querySelector('.trailer-modal__farame-container').innerHTML = markup;
  document
    .querySelector('.trailer-modal__farame')
    .classList.remove('is-hidden');
};
