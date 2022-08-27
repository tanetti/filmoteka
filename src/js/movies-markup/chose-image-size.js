import { DESKTOP_MIN_WIDTH } from '../constants';

export const choseImageSize = poster_path => {
  if (window.innerWidth > DESKTOP_MIN_WIDTH)
    return `https://image.tmdb.org/t/p/w500${poster_path}`;

  return `https://image.tmdb.org/t/p/w342${poster_path}`;
};
