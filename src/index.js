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


export {};
