import { rootRefs } from '../root-refs';
import { moviesFetcher } from '../api/fether-instance';
import * as noImage from '../../images/no-img.jpg';

const modalMarkup = document.querySelector('.modal__container');
const modalWindow = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close-button');
const modalBackDrop = document.querySelector('.modal-backdrop');

rootRefs.moviesContainer.addEventListener('click', onContainerClick);
modalClose.addEventListener('click', closeModal);

function onContainerClick({ target }) {
  openModal();
  if (!target.dataset.movie) {
    return;
  }

  let modalCurrentMovie;

  for (let i = 0; i < moviesFetcher.queryData.length; i += 1) {
    if (moviesFetcher.queryData[i].id === Number(target.dataset.movie)) {
      modalCurrentMovie = moviesFetcher.queryData[i];
    }
  }

  console.log(modalCurrentMovie);

  modalRenderMarkup(modalCurrentMovie);
}

function modalRenderMarkup(item) {
  // console.log(item)
  // console.log(items.genre_ids)
  // if (items.genre_ids.legth >= 2) {

  // }
  // if (items.poster.patch === "") {
  //     items.poster.patch = items.original_title
  // }
  const markup = `<div class="modal__container">
    <div class="modal__img">
      <img ${
        item.poster_path
          ? moviesFetcher.choseImageSize(item.poster_path)
          : `src="${noImage}"`
      } alt="${item.title}">
    </div>
    <div class="modal__text">
      <h2 class="modal__title"> ${item.original_title}</h2>
      <tbody class="modal__table">
        <tr>
          <td class="table_first_column">Vote/Votes</td>
          <td class="table_second_column"><p class="table_vote"><p class="modal_table_vote">${
            item.vote_average
          }</p>/${item.vote_count}</p></td>

        </tr>
        <tr>
          <td class="table_first_column">Popularity</td>
          <td class="table_second_column">${item.popularity}</td>

        </tr>
        <tr>
          <td class="table_first_column"> Original title</td>
          <td class="table_second_column">${item.original_title}</td>

        </tr>
        <tr>
          <td class="table_first_column">Genre</td>
          <td class="table_second_column">${item.genre_ids}</td>

        </tr>
      </tbody>
      <h3 class="modal_title_about">ABOUT</h3>
      <p class="modal_overview">${item.overview}</p>
      <div>
        <button type="button" class="modal_button"> WATCHED</button>
        <button type="button" class="modal_button"> QUEUE</button>
      </div>
    </div>

   </div>
  `;
  //

  // console.log(markup);
  modalMarkup.innerHTML = markup;
}

function openModal() {
  modalWindow.classList.add('is-shown');
  modalBackDrop.classList.add('is-shown');
}

function closeModal() {
  modalWindow.classList.remove('is-shown');
  modalBackDrop.classList.remove('is-shown');
}
