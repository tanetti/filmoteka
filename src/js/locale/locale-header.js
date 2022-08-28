import { rootRefs } from '../root-refs';
import { localeDB } from './';
import { LOCALE_TRANSITION_TIME } from '../constants';
// import { wrap } from 'lodash';

const refs = {
  headerLocaleFields: rootRefs.headerContainer.querySelectorAll(
    '[data-locale_field]'
  ),
  myLibraryBtn: document.querySelector('[data-locale_field="library"]'),
  homeBtnEl: document.querySelector('[data-locale_field="home"]'),
  formEl: document.querySelector('.form-wrap'),
  BtnMyLibraryWatchedEl: document.querySelector('button[data-locale_field="watched"]'),
  BtnMyLibraryQueueEl: document.querySelector('button[data-locale_field="queue"]'),
  headerEl: document.querySelector('header'),
};

refs.myLibraryBtn.addEventListener('click', onClickBtnLibrary);
refs.homeBtnEl.addEventListener('click', onClickBtnHome);
refs.BtnMyLibraryWatchedEl.addEventListener('click', onClickBtnWatch);
refs.BtnMyLibraryQueueEl.addEventListener('click', onClickBtnQueue);


function onClickBtnWatch (e){
  e.preventDefault();

  if(refs.BtnMyLibraryWatchedEl){
    refs.BtnMyLibraryWatchedEl.classList.add('header__button--active');
    refs.BtnMyLibraryQueueEl.classList.remove('header__button--active');
    
    }
}

function onClickBtnQueue (e){
  e.preventDefault();

  if(refs.BtnMyLibraryQueueEl){
    refs.BtnMyLibraryWatchedEl.classList.remove('header__button--active');
    refs.BtnMyLibraryQueueEl.classList.add('header__button--active');
    
    }
}



function onClickBtnLibrary (e) {
  e.preventDefault();
  
  if(refs.myLibraryBtn){
    refs.headerEl.classList.remove('header__background--home');
    refs.headerEl.classList.add('header__background--library');
    
    refs.homeBtnEl.classList.remove('header__navigation-link__active');
    refs.myLibraryBtn.classList.add('header__navigation-link__active');
  refs.BtnMyLibraryWatchedEl.classList.add('header__button--active');
  refs.formEl.classList.add('is-hidden');
  refs.BtnMyLibraryWatchedEl.classList.remove('is-hidden');
  refs.BtnMyLibraryQueueEl.classList.remove('is-hidden');
  } 
  
  
  };
  
  function onClickBtnHome (e) {
    e.preventDefault();
    
    if(refs.homeBtnEl){
      refs.headerEl.classList.remove('header__background--library');
      refs.headerEl.classList.add('header__background--home');
      refs.homeBtnEl.classList.add('header__navigation-link__active');
    refs.myLibraryBtn.classList.remove('header__navigation-link__active');
      refs.formEl.classList.remove('is-hidden');
      refs.BtnMyLibraryWatchedEl.classList.add('is-hidden');
      refs.BtnMyLibraryQueueEl.classList.add('is-hidden');
      }
    };



export const setHeaderLocaleFields = locale => {
  for (const localeField of refs.headerLocaleFields) {
    if (localeField.placeholder) {
      if (document.body.classList.contains('is-loaded')) {
        localeField.classList.add(
          'placeholder-opacity-transition',
          'placeholder-opacity'
        );
        setTimeout(() => {
          localeField.placeholder =
            localeDB[locale].header[localeField.dataset.locale_field];

          localeField.classList.remove('placeholder-opacity');
        }, LOCALE_TRANSITION_TIME);

        continue;
      }

      localeField.placeholder =
        localeDB[locale].header[localeField.dataset.locale_field];
    }

    if (document.body.classList.contains('is-loaded')) {
      localeField.classList.add('opacity-transition', 'opacity');
      setTimeout(() => {
        localeField.textContent =
          localeDB[locale].header[localeField.dataset.locale_field];

        localeField.classList.remove('opacity');
      }, LOCALE_TRANSITION_TIME);

      continue;
    }

    localeField.textContent =
      localeDB[locale].header[localeField.dataset.locale_field];
  }
};
