import { pageState } from '../state';
import { localeDB } from '../locale';
import { TABLET_MIN_WIDTH } from '../constants';

export const paginationRendering = (currentPage, totalPages) => {
  if (totalPages === 1 || !totalPages) return '';

  let paginationMarkup = '';

  paginationMarkup += `<button class="pagination__button pagination__button--side" type="button" ${
    currentPage === 1 ? 'disabled="true"' : ''
  } aria-label="${
    localeDB[pageState.locale].pagination.previous
  }" data-actions="prev" data-click="pagination">
      <svg class="parination__arrow" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path d="M13 8H3m5 5L3 8l5-5" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>`;

  if (window.innerWidth < TABLET_MIN_WIDTH) {
    for (let i = 1; i < Math.min(6, totalPages); i += 1) {
      if (currentPage <= 3 || totalPages < 6) {
        paginationMarkup += `<button class="pagination__button" type="button" ${
          currentPage === i ? 'disabled="true"' : ''
        } data-actions="${i}" data-click="pagination">${i}</button>`;

        continue;
      }

      if (currentPage > totalPages - 3) {
        const shift = currentPage - (totalPages - 5);

        paginationMarkup += `<button class="pagination__button" type="button" ${
          currentPage === currentPage + i - shift ? 'disabled="true"' : ''
        } data-actions="${currentPage + i - shift}" data-click="pagination">${
          currentPage + i - shift
        }</button>`;

        continue;
      }

      paginationMarkup += `<button class="pagination__button" type="button" ${
        currentPage === currentPage - 3 + i ? 'disabled="true"' : ''
      } data-actions="${currentPage - 3 + i}" data-click="pagination">${
        currentPage - 3 + i
      }</button>`;
    }
  }

  if (window.innerWidth >= TABLET_MIN_WIDTH) {
    paginationMarkup += `<button class="pagination__button" type="button" ${
      currentPage === 1 ? 'disabled="true"' : ''
    } data-actions="1" data-click="pagination">1</button>`;

    for (let i = 2; i < Math.min(7, totalPages); i += 1) {
      if (currentPage <= 4 || totalPages < 7) {
        paginationMarkup += `<button class="pagination__button" type="button" ${
          currentPage === i ? 'disabled="true"' : ''
        } data-actions="${i}" data-click="pagination">${i}</button>${
          i === 6 && totalPages - 6 > 1
            ? '<div class="pagination__delimiter">...</div>'
            : ''
        }`;

        continue;
      }

      if (currentPage > totalPages - 4) {
        const shift = currentPage - (totalPages - 7);

        paginationMarkup += `${
          i === 2 && totalPages > 7
            ? '<div class="pagination__delimiter">...</div>'
            : ''
        }<button class="pagination__button" type="button" ${
          currentPage === currentPage + i - shift ? 'disabled="true"' : ''
        } data-actions="${currentPage + i - shift}" data-click="pagination">${
          currentPage + i - shift
        }</button>`;

        continue;
      }

      paginationMarkup += `${
        i === 2 ? '<div class="pagination__delimiter">...</div>' : ''
      }<button class="pagination__button" type="button" ${
        currentPage === currentPage - 4 + i ? 'disabled="true"' : ''
      } data-actions="${currentPage - 4 + i}" data-click="pagination">${
        currentPage - 4 + i
      }</button>${
        i === 6 && totalPages - currentPage - 4 + i > 1
          ? '<div class="pagination__delimiter">...</div>'
          : ''
      }`;
    }

    paginationMarkup += `<button class="pagination__button" type="button" ${
      currentPage === totalPages ? 'disabled="true"' : ''
    } data-actions="${totalPages}" data-click="pagination">${totalPages}</button>`;
  }

  paginationMarkup += `<button class="pagination__button pagination__button--side" type="button" ${
    currentPage === totalPages ? 'disabled="true"' : ''
  } aria-label="${
    localeDB[pageState.locale].pagination.next
  }" data-actions="next" data-click="pagination">
    <svg class="parination__arrow" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M3 8h10m-5 5 5-5-5-5" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>`;

  return paginationMarkup;
};
