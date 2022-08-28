import { rootRefs } from '../root-refs';
import carousel from './slider/slider';

const closeBtn = document.querySelector('[data-footer_close]');

closeBtn.addEventListener('click', onCloseModal);
rootRefs.footerButton.addEventListener('click', onOpenModal);

function onOpenModal() {
  rootRefs.footerBackdrop.classList.add('is-shown');
  rootRefs.footerModal.classList.add('is-shown');
  carousel();
}

function onCloseModal() {
  rootRefs.footerBackdrop.classList.remove('is-shown');
  rootRefs.footerModal.classList.remove('is-shown');
}
