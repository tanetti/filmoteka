import { rootRefs } from '../root-refs';
import { moviesFetcher } from '../api';
import { onScrollToTopClick } from '../scroll';
import { PAGINATION_ACTION_DELAY } from '../constants';

export const onEscPress = ({ code }) => {
  if (code === 'Escape') {
    onScrollToTopClick();

    rootRefs.searchField.value = '';
    moviesFetcher.query = null;

    setTimeout(() => moviesFetcher.renderTrending(), PAGINATION_ACTION_DELAY);

    window.removeEventListener('keydown', onEscPress);
  }
};
