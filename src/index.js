/**
 * @fileoverview Entry point for the app. Initialize all Glue components.
 */

import {
    Carousel,
    PaginationModelFactory,
    PaginationNext,
    PaginationPageList,
    PaginationPrevious,
    Header,
    Tabs,
    PaginationPages,
} from '@google/glue';

const paginationModel = PaginationModelFactory.get('demo-cyclical');
paginationModel.cyclical = true;

/**
 * @param {string} selector CSS selector.
 * @param {!Function} cb A reference to an attachTo() static method.
 * @param {!Object=} opts Parameters to pass to the component.
 */
const init = (selector, cb, opts = {}) =>
    [...document.querySelectorAll(selector)].forEach((el) => cb(el, opts));

// Initializes Glue carousel
init('.glue-pagination-page-list', PaginationPageList.attachTo);
init('[data-glue-pagination-previous]', PaginationPrevious.attachTo);
init('[data-glue-pagination-next]', PaginationNext.attachTo);
init('.glue-carousel', Carousel.attachTo);

// Initializes Glue header
init('.glue-header', (element) => new Header(element));

// Initializes Glue Tabs
init('.glue-tabs', Tabs.attachTo);
init('.glue-tabset .glue-pagination-pages', PaginationPages.attachTo);


//mouseover events
const dots = document.querySelectorAll('.graphic__dot-interact');
const info = document.querySelectorAll('.graphic__info');

for (let index = 0; index < dots.length; index++) {
  const element = dots[index];
  const dotIndex = element.getAttribute('data-dot-index');
  const parentEl = element.parentElement;
  const parentElRect = parentEl.getBoundingClientRect();
  const parentTop = parentElRect.top;
  const parentLeft = parentElRect.left;

  console.log(parentTop, parentLeft)

  for (let i = 0; i < info.length; i++) {
    const el = info[i];
    const dotInfo = el.getAttribute('data-dot-info')

    switch (dotIndex) {
      case dotInfo:

      let x = element.offsetLeft;
      let y = element.offsetTop;

      console.log(element)

      // console.log(element, 'x: ', x);
      // console.log(element, 'y: ', y);

      el.style.top = y + 'px';
      el.style.left = x + 'px';
    
      default:
        break;
    }

    // if (dotIndex == dotInfo) {
    //   let x = element.offsetLeft;
    //   let y = element.offsetTop;

    //   console.log(element, x, y)

    //   // console.log(element, 'x: ', x);
    //   // console.log(element, 'y: ', y);

    //   el.style.top = y + 'px';
    //   el.style.left = x + 'px';
    // }
  }

  element.addEventListener('mouseover', () => {

    for (let i = 0; i < info.length; i++) {
      const el = info[i];
      const dotInfo = el.getAttribute('data-dot-info')

      if (dotIndex == dotInfo) {
        el.style.opacity = 1;
      }
    }
    
  })

  element.addEventListener('mouseleave', () => {

    for (let i = 0; i < info.length; i++) {
      const el = info[i];
      const dotInfo = el.getAttribute('data-dot-info')

      if (dotIndex == dotInfo) {
        el.style.opacity = 0;
      }
    }
    
  })
    
}


export {};
