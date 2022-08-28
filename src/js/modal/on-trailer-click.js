import { moviesFetcher } from '../api';
import { openModal } from './';

export const onTrailerClick = async target => {
  const trailersData = await moviesFetcher.fetchVideos(target.dataset.movie);
  // console.log(trailersData);

  function renderTrailer() {
    document.querySelector('.frame-wrapper').innerHTML = '';
    let key;
    if (trailersData.length === 0) {
      key = '2U76x2fD_tE';
    }

    trailersData.map(trailerData => {
      trailerData.name === 'Official Trailer'
        ? (key = trailerData.key)
        : (key = trailersData[0].key);
    });
    const markup = `<iframe width="560" height="315" src='https://www.youtube.com/embed/${key}'frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

    document
      .querySelector('.frame-wrapper')
      .insertAdjacentHTML('beforeend', markup);
  }

  renderTrailer();

  openModal(target);
};
