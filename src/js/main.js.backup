// Mobile menu toggle
const mobileMenuButton = document.querySelector('button.md\\:hidden');
const mobileMenu = document.querySelector('.md\\:hidden.hidden');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

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
                t.classList.remove('text-[#B4CBD1]', 'border-b-2', 'border-[#B4CBD1]');
                t.classList.add('text-gray-500');
            });
            // Add active styles to clicked tab
            this.classList.add('text-[#B4CBD1]', 'border-b-2', 'border-[#B4CBD1]');
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

// Opinions carousel
function handleOpinionsCarousel() {
    const carousel = document.getElementById('opinions-carousel');
    if (!carousel) {
        return;
    }
    const slides = Array.from(carousel.querySelectorAll('.opinion-slide'));
    const prevBtn = document.getElementById('opinions-prev');
    const nextBtn = document.getElementById('opinions-next');
    const dotsContainer = document.getElementById('opinions-dots');
    let current = 0;
    let slidesToShow = 1; // Always show only 1 slide

    function updateSlidesToShow() {
        slidesToShow = 1; // Always 1
    }

    function updateCarousel() {
        updateSlidesToShow();
        const slideWidth = 100 / slidesToShow;
        carousel.style.transform = `translateX(-${current * slideWidth}%)`;
        slides.forEach(slide => {
            slide.style.width = `${slideWidth}%`;
        });
        updateDots();
    }

    function updateDots() {
        if (!dotsContainer) {
            return;
        }
        dotsContainer.innerHTML = '';
        const total = Math.max(1, slides.length - slidesToShow + 1);
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'w-3 h-3 rounded-full ' + (i === current ? 'bg-[#B4CBD1]' : 'bg-gray-300') + ' focus:outline-none';
            dot.addEventListener('click', () => {
                current = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(idx) {
        const total = Math.max(1, slides.length - slidesToShow + 1);
        current = Math.max(0, Math.min(idx, total - 1));
        updateCarousel();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(current - 1);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(current + 1);
        });
    }

    window.addEventListener('resize', () => {
        updateSlidesToShow();
        // Clamp current to valid range after resize
        goToSlide(current);
    });

    // Initialize
    updateSlidesToShow();
    goToSlide(0);
}
document.addEventListener('DOMContentLoaded', handleOpinionsCarousel);

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
        '<div id="booking-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">' +
            '<div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">' +
                '<button id="close-modal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">' +
                    '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>' +
                    '</svg>' +
                '</button>' +
                '<div class="p-6 md:p-8">' +
                    '<h2 class="text-2xl md:text-3xl font-bold text-center mb-6 text-[#1D343B]">Umów wizytę w Klinice OrthoCare</h2>' +
                    '<div class="flex justify-center">' +
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