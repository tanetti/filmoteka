import { moviesFetcher } from '../api';
import { openModal } from './';

export const onTrailerClick = async target => {
  const trailersData = await moviesFetcher.fetchVideos(target.dataset.movie);

  console.log(trailersData);

  openModal(target);
};
