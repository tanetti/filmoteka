import { moviesFetcher } from '../api';
import { openModal } from './';

export const onTrailerClick = async target => {
  const trailersData = await moviesFetcher.fetchVideos(target.dataset.movie);

  function renderTrailer() {
    document.querySelector('.frame-wrapper').innerHTML = '';

    const markup = `<iframe width="560" height="315" src='https://www.youtube.com/embed/${trailersData[0].key}'frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

    document
      .querySelector('.frame-wrapper')
      .insertAdjacentHTML('beforeend', markup);
  }

  renderTrailer();

  openModal(target);
};
