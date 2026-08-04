// Mobile menu (reference nav)
function closeMobile() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.getElementById('menuBtn');
    if (mobileMenu) {
        mobileMenu.classList.remove('open');
    }
    if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('nav-open');
}
window.closeMobile = closeMobile;

function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!menuBtn || !mobileMenu) {
        return;
    }
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.onclick = function () {
        const isOpen = mobileMenu.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.classList.toggle('nav-open', isOpen);
    };
    mobileMenu.querySelectorAll('a, .umow-wizyte-btn').forEach(function (link) {
        link.addEventListener('click', closeMobile);
    });
}

document.addEventListener('DOMContentLoaded', initMobileMenu);
window.reinitMobileMenu = initMobileMenu;

// Counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    function update() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString('pl-PL');
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString('pl-PL');
        }
    }
    update();
}

function handleCounterAnimation() {
    const section = document.getElementById('counter-section');
    if (!section) {
        return;
    }
    const counters = section.querySelectorAll('.counter');
    let animated = false;
    function onScroll() {
        const rect = section.getBoundingClientRect();
        if (!animated && rect.top < window.innerHeight && rect.bottom > 0) {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'), 10);
                animateCounter(counter, target);
            });
            animated = true;
            window.removeEventListener('scroll', onScroll);
        }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
}

document.addEventListener('DOMContentLoaded', handleCounterAnimation);

// Service tabs switching
function handleServiceTabs() {
    const tabs = document.querySelectorAll('#service-tabs button');
    const tabContents = document.querySelectorAll('.tab-content');
    if (!tabs || tabs.length === 0) {
        return;
    }
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active styles from all tabs
            tabs.forEach(t => {
                t.classList.remove('text-brand', 'border-b-2', 'border-brand');
                t.classList.add('text-gray-500');
            });
            // Add active styles to clicked tab
            this.classList.add('text-brand', 'border-b-2', 'border-brand');
            this.classList.remove('text-gray-500');
            // Show corresponding tab content
            const tabName = this.getAttribute('data-tab');
            tabContents.forEach(content => {
                if (content.getAttribute('data-tab-content') === tabName) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });
        });
    });
}
document.addEventListener('DOMContentLoaded', handleServiceTabs);

// Expand/collapse extra chips
function handleExpandChips() {
    const expandBtn = document.getElementById('expand-chips-btn');
    if (!expandBtn) {
        return;
    }
    const getActiveTabContent = () => {
        return document.querySelector('.tab-content:not(.hidden)');
    };
    expandBtn.addEventListener('click', function () {
        const activeTab = getActiveTabContent();
        if (!activeTab) {
            return;
        }
        const extraChips = activeTab.querySelectorAll('.extra-chip');
        const isExpanded = extraChips.length > 0 && !extraChips[0].classList.contains('hidden');
        extraChips.forEach(chip => {
            chip.classList.toggle('hidden', isExpanded);
        });
        expandBtn.textContent = isExpanded ? 'Rozwiń więcej' : 'Zwiń';
    });
    // Hide extra chips when switching tabs
    document.querySelectorAll('#service-tabs button').forEach(tab => {
        tab.addEventListener('click', () => {
            const allTabContents = document.querySelectorAll('.tab-content');
            allTabContents.forEach(tabContent => {
                tabContent.querySelectorAll('.extra-chip').forEach(chip => chip.classList.add('hidden'));
            });
            expandBtn.textContent = 'Rozwiń więcej';
        });
    });
}
document.addEventListener('DOMContentLoaded', handleExpandChips);

// Testimonials grid (reference design)
function initTestimonials() {
    const reviews = [
        { stars: 5, text: 'Świetny lekarz — widać, że zna się na tym, co robi. Jestem bardzo zadowolona z efektu leczenia, moje kolano odzyskało sprawność.', name: 'Ilona', source: 'Google' },
        { stars: 5, text: 'Super lekarz, wszystko dokładnie omawia, odpowiada wyczerpująco na każde pytanie, dokładnie bada. Atmosfera w gabinecie świetna.', name: 'Piotr R.', source: 'Google' },
        { stars: 5, text: 'Profesjonalne podejście do pacjenta. Lekarz wszystko wyjaśnił zrozumiale i był bardzo pomocny. Polecam z całego serca.', name: 'Tadeusz S.', source: 'Google' },
        { stars: 5, text: 'Bardzo sympatyczny, kompetentny lekarz, świetny kontakt z pacjentem. Słucha i odpowiada na pytania — dziękuję.', name: 'Urszula', source: 'Google' },
        { stars: 5, text: 'Lekarz bardzo merytoryczny, konkretny, a jednocześnie bardzo przyjazny. Uważnie słucha pacjenta i odpowiada zrozumiałym językiem.', name: 'Izabela', source: 'Google' },
        { stars: 5, text: 'Polecam bardzo miły lekarz, dokładnie wyjaśnia co powoduje ból i jak można go zniwelować. Wizyta punktualna i profesjonalna.', name: 'Szymon', source: 'Google' },
    ];
    const grid = document.getElementById('testGrid');
    if (!grid) {
        return;
    }
    let perPage = window.innerWidth <= 920 ? 1 : (window.innerWidth <= 1100 ? 2 : 3);
    let pages = Math.ceil(reviews.length / perPage);
    let cur = 0;
    let swipeBound = false;

    function isMobileReviews() {
        return window.innerWidth <= 920;
    }

    function activeReviewIndex() {
        const cards = grid.querySelectorAll('.review-card');
        if (!cards.length) {
            return 0;
        }
        const cardWidth = cards[0].offsetWidth + 16;
        if (!cardWidth) {
            return 0;
        }
        return Math.max(0, Math.min(cards.length - 1, Math.round(grid.scrollLeft / cardWidth)));
    }

    function scrollToReview(index) {
        const cards = grid.querySelectorAll('.review-card');
        const card = cards[index];
        if (!card) {
            return;
        }
        const left = card.offsetLeft - (grid.clientWidth - card.clientWidth) / 2;
        grid.scrollTo({ left: left, behavior: 'smooth' });
    }

    function cardHtml(r) {
        const initial = r.name.charAt(0).toUpperCase();
        return '<article class="review-card">' +
            '<div class="review-card__head">' +
            '<div class="review-card__avatar">' + initial + '</div>' +
            '<div class="review-card__meta">' +
            '<div class="review-card__name">' + r.name + '</div>' +
            '<div class="review-card__source">' + r.source + ' · ★★★★★</div>' +
            '</div></div>' +
            '<div class="review-card__stars">' + '★'.repeat(r.stars) + '</div>' +
            '<p class="review-card__text">' + r.text + '</p>' +
            '</article>';
    }

    function go(n) {
        cur = (n + pages) % pages;
        const s = reviews.slice(cur * perPage, cur * perPage + perPage);
        grid.innerHTML = s.map(cardHtml).join('');
    }

    function rebuild() {
        if (isMobileReviews()) {
            grid.classList.add('reviews-track--swipe');
            grid.innerHTML = reviews.map(cardHtml).join('');
            if (!swipeBound) {
                bindHorizontalSwipe(grid.parentElement, grid);
                swipeBound = true;
            }
            return;
        }
        grid.classList.remove('reviews-track--swipe');
        perPage = window.innerWidth <= 1100 ? 2 : 3;
        pages = Math.ceil(reviews.length / perPage);
        if (cur >= pages) cur = 0;
        go(cur);
    }

    rebuild();
    window.addEventListener('resize', rebuild);
    var tPrev = document.getElementById('tPrev');
    var tNext = document.getElementById('tNext');
    if (tPrev) {
        tPrev.onclick = function () {
            if (isMobileReviews()) {
                scrollToReview(Math.max(0, activeReviewIndex() - 1));
            } else {
                go(cur - 1);
            }
        };
    }
    if (tNext) {
        tNext.onclick = function () {
            if (isMobileReviews()) {
                const cards = grid.querySelectorAll('.review-card');
                scrollToReview(Math.min(cards.length - 1, activeReviewIndex() + 1));
            } else {
                go(cur + 1);
            }
        };
    }
}

document.addEventListener('DOMContentLoaded', initTestimonials);

function bindHorizontalSwipe(root, track) {
    if (!root || !track) {
        return;
    }
    var state = null;
    root.addEventListener('touchstart', function (e) {
        if (!e.touches[0]) {
            return;
        }
        state = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            scroll: track.scrollLeft,
            locked: null
        };
    }, { passive: true });
    root.addEventListener('touchmove', function (e) {
        if (!state || !e.touches[0]) {
            return;
        }
        var dx = e.touches[0].clientX - state.x;
        var dy = e.touches[0].clientY - state.y;
        if (state.locked === null) {
            if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
                return;
            }
            state.locked = Math.abs(dx) > Math.abs(dy);
        }
        if (state.locked) {
            track.scrollLeft = state.scroll - dx;
        }
    }, { passive: true });
    root.addEventListener('touchend', function () {
        state = null;
    });
}

function initPracticeCardsCarousel() {
    const carousel = document.querySelector('[data-cards-carousel]');
    if (!carousel) {
        return;
    }
    const track = carousel.querySelector('[data-cards-track]');
    const prev = carousel.querySelector('[data-cards-prev]');
    const next = carousel.querySelector('[data-cards-next]');
    if (!track) {
        return;
    }
    const cards = Array.from(track.children).filter(function (el) {
        return el.classList.contains('card3');
    });
    if (cards.length === 0) {
        return;
    }

    function activeIndex() {
        const cardWidth = cards[0].offsetWidth + 16;
        if (!cardWidth) {
            return 0;
        }
        return Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / cardWidth)));
    }

    function scrollToIndex(index) {
        const card = cards[index];
        if (!card) {
            return;
        }
        const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
        track.scrollTo({ left: left, behavior: 'smooth' });
    }

    if (prev) {
        prev.addEventListener('click', function () {
            scrollToIndex(Math.max(0, activeIndex() - 1));
        });
    }
    if (next) {
        next.addEventListener('click', function () {
            scrollToIndex(Math.min(cards.length - 1, activeIndex() + 1));
        });
    }

    bindHorizontalSwipe(carousel, track);
}

document.addEventListener('DOMContentLoaded', initPracticeCardsCarousel);

// Booking modal open/close
function handleBookingModal() {
    const modal = document.getElementById('booking-modal');
    const openButtons = document.querySelectorAll('.umow-wizyte-btn');
    const closeButton = document.getElementById('close-modal');
    const body = document.body;

    if (!modal || openButtons.length === 0) {
        return;
    }

    function openModal() {
        modal.classList.remove('hidden');
        body.classList.add('overflow-hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
        body.classList.remove('overflow-hidden');
    }

    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobile();
            openModal();
        });
    });

    if (closeButton) {
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    }

    // Close when clicking on backdrop (outside modal content)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', handleBookingModal);

// Delegated booking modal handling for pages that load header dynamically
function ensureBookingWidgetScript() {
    if (!document.getElementById('zl-widget-s')) {
        const script = document.createElement('script');
        script.id = 'zl-widget-s';
        script.src = '//platform.docplanner.com/js/widget.js';
        document.head.appendChild(script);
    }
}

function ensureBookingModalElement() {
    let modal = document.getElementById('booking-modal');
    if (modal) {
        return modal;
    }
    const wrapper = document.createElement('div');
    wrapper.innerHTML = (
        '<div id="booking-modal" class="booking-modal hidden">' +
            '<div class="booking-modal__panel">' +
                '<button id="close-modal" type="button" class="booking-modal__close" aria-label="Zamknij">' +
                    '<svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>' +
                    '</svg>' +
                '</button>' +
                '<div class="booking-modal__body">' +
                    '<h2 class="heading booking-modal__title">Umów wizytę w Klinice OrthoCare</h2>' +
                    '<div class="booking-modal__widget">' +
                        '<a class="zl-facility-url" href="https://www.znanylekarz.pl/placowki/klinika-orthocare" rel="nofollow" data-zlw-facility="klinika-orthocare" data-zlw-type="facility-big" data-zlw-saas-only="true" data-zlw-a11y-title="Widget umówienia wizyty lekarskiej">Klinika OrthoCare</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
    modal = wrapper.firstElementChild;
    document.body.appendChild(modal);
    return modal;
}

function openBookingModal(modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
}

function closeBookingModal(modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

function initDelegatedBookingModal() {
    if (window.__bookingModalDelegatedInit) {
        return;
    }
    window.__bookingModalDelegatedInit = true;

    // Open via any dynamically added ".umow-wizyte-btn"
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest && e.target.closest('.umow-wizyte-btn');
        if (trigger) {
            e.preventDefault();
            closeMobile();
            ensureBookingWidgetScript();
            const modal = ensureBookingModalElement();
            openBookingModal(modal);
            return;
        }

        // Close button inside modal
        const closeBtn = e.target.closest && e.target.closest('#close-modal');
        if (closeBtn) {
            e.preventDefault();
            const modal = document.getElementById('booking-modal');
            if (modal) {
                closeBookingModal(modal);
            }
            return;
        }
    });

    // Backdrop click to close (capture to ensure we get the modal element)
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('booking-modal');
        if (!modal) {
            return;
        }
        if (e.target === modal) {
            closeBookingModal(modal);
        }
    });

    // Escape to close
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') {
            return;
        }
        const modal = document.getElementById('booking-modal');
        if (modal && !modal.classList.contains('hidden')) {
            closeBookingModal(modal);
        }
    });
}

document.addEventListener('DOMContentLoaded', initDelegatedBookingModal);

// Procedure accordion (Zabiegi)
function toggleProcedure(id) {
    const content = document.getElementById('content-' + id);
    const icon = document.getElementById('icon-' + id);
    if (!content || !icon) {
        return;
    }
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}
window.toggleProcedure = toggleProcedure;

// Service accordion (Cennik)
function toggleService(serviceId) {
    const content = document.getElementById('content-' + serviceId);
    const icon = document.getElementById('icon-' + serviceId);
    if (!content || !icon) {
        return;
    }
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}
window.toggleService = toggleService;

// Gallery lightbox (O nas)
function openGalleryModal(imageId) {
    const modal = document.getElementById('gallery-modal');
    const clickedImage = document.querySelector('[onclick="openGalleryModal(\'' + imageId + '\')"] img');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    if (!modal || !clickedImage || !modalImage) {
        return;
    }
    modalImage.src = clickedImage.dataset.fullSrc || clickedImage.src;
    modalImage.alt = clickedImage.alt || 'Klinika OrthoCare';
    if (modalCaption) {
        modalCaption.textContent = clickedImage.alt || 'Klinika OrthoCare';
    }
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');
}
window.openGalleryModal = openGalleryModal;

function closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    if (modal) {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
    }
    if (modalImage) {
        modalImage.removeAttribute('src');
    }
    document.body.classList.remove('nav-open');
}
window.closeGalleryModal = closeGalleryModal;

function initGalleryLightbox() {
    var galleryModal = document.getElementById('gallery-modal');
    if (!galleryModal) {
        return;
    }
    galleryModal.addEventListener('click', function (e) {
        if (e.target.classList.contains('gallery-lightbox__backdrop')) {
            closeGalleryModal();
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && galleryModal && !galleryModal.classList.contains('hidden')) {
            closeGalleryModal();
        }
    });
}

function initAnchorNav() {
    /* multi-page site — anchor nav not used */
}
window.initAnchorNav = initAnchorNav;

function scrollToHashOnLoad() {
    /* no-op on multi-page site */
}

// Gallery modal click-outside handler on home page
document.addEventListener('DOMContentLoaded', function () {
    initAnchorNav();
    scrollToHashOnLoad();
    initGalleryLightbox();
});

// Re-init mobile menu after dynamic header load on doctor pages
