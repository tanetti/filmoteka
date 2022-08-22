import { rootRefs } from '../root-refs';
import { moviesFetcher } from '../api';

export const onEscPress = ({ code }) => {
  if (code === 'Escape') {
    rootRefs.searchField.value = '';

    moviesFetcher.query = null;
    moviesFetcher.renderTrending();

    window.removeEventListener('keydown', onEscPress);
  }
};
