import EmblaCarousel from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import {
  onSliderNavigationClick,
  followSliderView,
} from './slider-navigation-actions';
import { rootRefs } from '../root-refs';

const autoplay = Autoplay(
  {
    delay: 3000,
    playOnInit: false,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  },
  emblaRoot => emblaRoot.parentElement
);

export const teamSlider = EmblaCarousel(
  rootRefs.teamSliderView,
  {
    selectedClass: '',
    loop: true,
    skipSnaps: false,
  },
  [autoplay]
);

const sliderNavigation = EmblaCarousel(rootRefs.teamSliderNavigation, {
  selectedClass: '',
  containScroll: 'keepSnaps',
  dragFree: true,
});

sliderNavigation.slideNodes().forEach((navNode, index) => {
  const onClick = onSliderNavigationClick(teamSlider, sliderNavigation, index);
  navNode.addEventListener('click', onClick, false);
});

const syncSliderNavigation = followSliderView(teamSlider, sliderNavigation);
teamSlider.on('select', syncSliderNavigation);
sliderNavigation.on('init', syncSliderNavigation);
