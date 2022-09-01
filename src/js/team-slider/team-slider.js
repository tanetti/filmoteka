import EmblaCarousel from 'embla-carousel';
import { onNavigationClick, followSliderView } from './';
import { rootRefs } from '../root-refs';

export function initTeamModalSlider() {
  const sliderView = EmblaCarousel(rootRefs.teamSliderView, {
    selectedClass: '',
    loop: true,
    skipSnaps: false,
  });

  const sliderNavigation = EmblaCarousel(rootRefs.teamSliderNavigation, {
    selectedClass: '',
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  sliderNavigation.slideNodes().forEach((navNode, index) => {
    const onClick = onNavigationClick(sliderView, sliderNavigation, index);
    navNode.addEventListener('click', onClick);
  });

  const syncSliderNavigation = followSliderView(sliderView, sliderNavigation);
  sliderView.on('select', syncSliderNavigation);
  sliderNavigation.on('init', syncSliderNavigation);
}
