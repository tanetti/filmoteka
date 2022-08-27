import { rootRefs } from '../root-refs';

rootRefs.footerButton.addEventListener('click', onOpenModal);

function onOpenModal() {
  rootRefs.footerModal.classList.toggle('visually-hidden');
}
