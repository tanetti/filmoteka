import { rootRefs } from "../root-refs";
import { moviesFetcher } from "../api/fether-instance";

let modalCurrentMovie
const modalMarkup = document.querySelector('.modal__container');
const modalWindow = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close-button');
const modalBackDrop = document.querySelector('.modal-backdrop')



rootRefs.moviesContainer.addEventListener('click', onContainerClick);
modalClose.addEventListener('click', closeModal)

function onContainerClick({ target } ) {
openModal()
    if (!target.dataset.movie) {
        return
    }
   
    
    for (let i = 0; i < moviesFetcher.queryData.length; i += 1) {
        if (moviesFetcher.queryData[i].id === Number(target.dataset.movie)) {
            modalCurrentMovie = moviesFetcher.queryData[i];
            console.log(modalCurrentMovie)
            
        }
    }

ModalRenderMarkup(modalCurrentMovie)
}


function ModalRenderMarkup(items) {
    console.log(items)
    const markup = items.map(item => {return`<div class="modal__container">
    <div class="modal__img"> ${item.backdrop_patch}</div>
    <div class="modal__text"> 
      <h2 class="modal__title"> ${item.original_title}</h2>
      <tbody class="modal__table">
        <tr>
          <td class="table_first_column">Vote/Votes</td>
          <td class="table_second_column"><p class="table_vote"><p class="modal_table_vote">${item.vote_average}</p>/${item.vote_count}</p></td>
          
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
  `})
//   
    console.log(markup)
modalMarkup.innerHTML=markup
}

function openModal() {
    modalWindow.classList.add('is-shown');
    modalBackDrop.classList.add('is-shown')
}

function closeModal() {
    modalWindow.classList.remove('is-shown');
    modalBackDrop.classList.remove('is-shown')
}