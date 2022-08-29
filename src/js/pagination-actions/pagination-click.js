import { onScrollToTopClick } from '../scroll';
import { paginationAction } from './';
import { PAGINATION_ACTION_DELAY } from '../constants';

export const onPaginationClick = dataset => {
  onScrollToTopClick();

  setTimeout(() => paginationAction(dataset.actions), PAGINATION_ACTION_DELAY);
};
