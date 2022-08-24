import { pageState } from '../state';
import { onScrollToTopClick } from '../scroll';
import { paginationAction } from './';
import { PAGINATION_ACTION_DELAY } from '../constants';

export const onPaginationClick = ({ currentTarget, target }) => {
  const action = target.dataset.actions;

  if (currentTarget === target || !action) return;

  onScrollToTopClick();

  setTimeout(() => paginationAction(action), PAGINATION_ACTION_DELAY);
};
