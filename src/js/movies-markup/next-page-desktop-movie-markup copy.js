export const nextPageDesktopMovie = (localeDB, pageState) =>
  `<li class="movie">
        <button class="movie__container" type="button" aria-label="${
          localeDB[pageState.locale].movie.next
        }" data-actions="next" data-click="pagination">
          <span class="movie__image-container">  
            <svg class="movie__image movie__image--next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.7 192.7" style="enable-background:new 0 0 192.689 192.689" xml:space="preserve"><path d="M189 88 106 4c-5-5-13-5-17 0-5 4-5 12 0 17l74 75-74 76c-5 5-5 12 0 17 4 5 12 5 17 0l83-84c4-5 4-13 0-17z"/><path d="M104 88 21 4C17-1 9-1 4 4 0 8 0 16 4 21l75 75-75 76c-4 5-4 12 0 17s13 5 17 0l83-84c5-5 5-13 0-17z"/></svg>
          </span>
          <span class="movie__data">
            <span class="movie__title">${
              localeDB[pageState.locale].movie.next
            }</span>
          </span>
        </button>
    </li>`;
