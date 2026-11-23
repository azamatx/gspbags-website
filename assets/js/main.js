(function () {
    'use strict';

    var translations = window.gsp_translations || {};
    var supported_languages = ['uz', 'ru', 'en'];
    var menu_toggle = document.querySelector('.menu-toggle');
    var nav_wrap = document.querySelector('.nav-wrap');
    var site_header = document.querySelector('.site-header');

    function get_path_language() {
        var segment = window.location.pathname.split('/').filter(Boolean)[0];
        return supported_languages.indexOf(segment) !== -1 ? segment : 'uz';
    }

    function get_stored_language() {
        try {
            var language = window.localStorage.getItem('gsp_language');
            return supported_languages.indexOf(language) !== -1 ? language : null;
        } catch (error) {
            return null;
        }
    }

    function store_language(language) {
        try {
            window.localStorage.setItem('gsp_language', language);
        } catch (error) {
            return;
        }
    }

    function language_path(language) {
        return language === 'uz' ? '/' : '/' + language + '/';
    }

    function update_meta(language) {
        var meta = translations[language].meta;
        var canonical_url = 'https://gspbags.uz' + language_path(language);
        var selectors = {
            'meta[name="description"]': meta.description,
            'meta[property="og:title"]': meta.title,
            'meta[property="og:description"]': meta.description,
            'meta[property="og:url"]': canonical_url,
            'meta[property="og:locale"]': meta.locale,
            'meta[name="twitter:title"]': meta.title,
            'meta[name="twitter:description"]': meta.description
        };

        document.title = meta.title;
        Object.keys(selectors).forEach(function (selector) {
            var element = document.querySelector(selector);
            if (element) {
                element.setAttribute('content', selectors[selector]);
            }
        });

        var canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.setAttribute('href', canonical_url);
        }
    }

    function apply_language(language, history_mode) {
        if (!translations[language]) {
            return;
        }

        var dictionary = translations[language].content;
        document.documentElement.lang = language;

        document.querySelectorAll('[data-i18n]').forEach(function (element) {
            var key = element.getAttribute('data-i18n');
            if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
                element.textContent = dictionary[key];
            }
        });

        document.querySelectorAll('[data-i18n-aria-label]').forEach(function (element) {
            var key = element.getAttribute('data-i18n-aria-label');
            if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
                element.setAttribute('aria-label', dictionary[key]);
            }
        });

        document.querySelectorAll('[data-i18n-alt]').forEach(function (element) {
            var key = element.getAttribute('data-i18n-alt');
            if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
                element.setAttribute('alt', dictionary[key]);
            }
        });

        document.querySelectorAll('[data-language]').forEach(function (link) {
            if (link.getAttribute('data-language') === language) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        if (menu_toggle) {
            var menu_key = menu_toggle.getAttribute('aria-expanded') === 'true' ? 'menu_close_label' : 'menu_label';
            menu_toggle.setAttribute('aria-label', dictionary[menu_key]);
        }

        update_meta(language);
        store_language(language);

        if (history_mode) {
            var next_url = language_path(language) + window.location.hash;
            window.history[history_mode + 'State']({ language: language }, '', next_url);
        }
    }

    function close_menu(return_focus) {
        if (!menu_toggle || !nav_wrap) {
            return;
        }

        menu_toggle.setAttribute('aria-expanded', 'false');
        menu_toggle.setAttribute('aria-label', translations[document.documentElement.lang].content.menu_label);
        nav_wrap.classList.remove('is-open');
        document.body.classList.remove('menu-open');

        if (return_focus) {
            menu_toggle.focus();
        }
    }

    function open_menu() {
        if (!menu_toggle || !nav_wrap) {
            return;
        }

        menu_toggle.setAttribute('aria-expanded', 'true');
        menu_toggle.setAttribute('aria-label', translations[document.documentElement.lang].content.menu_close_label);
        nav_wrap.classList.add('is-open');
        document.body.classList.add('menu-open');
    }

    if (menu_toggle && nav_wrap) {
        menu_toggle.addEventListener('click', function () {
            var is_open = menu_toggle.getAttribute('aria-expanded') === 'true';
            if (is_open) {
                close_menu(false);
            } else {
                open_menu();
            }
        });

        nav_wrap.addEventListener('click', function (event) {
            if (event.target.closest('a[href^="#"]')) {
                close_menu(false);
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && nav_wrap.classList.contains('is-open')) {
                close_menu(true);
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 1024) {
                close_menu(false);
            }
        });
    }

    document.addEventListener('click', function (event) {
        if (nav_wrap && nav_wrap.classList.contains('is-open') && !nav_wrap.contains(event.target) && !menu_toggle.contains(event.target)) {
            close_menu(false);
        }

        var language_link = event.target.closest('[data-language]');
        if (!language_link) {
            return;
        }

        event.preventDefault();
        apply_language(language_link.getAttribute('data-language'), 'push');
        close_menu(false);
    });

    window.addEventListener('popstate', function () {
        apply_language(get_path_language(), null);
    });

    function update_header_state() {
        if (site_header) {
            site_header.classList.toggle('is-scrolled', window.scrollY > 8);
        }
    }

    function initialize_motion() {
        var reveal_elements = document.querySelectorAll(
            '.section-heading, .about-panel, .about-copy, .product-image, .product-content, ' +
            '.application-card, .benefit-card, .faq-list, .contact-copy, .contact-links'
        );
        var hero = document.querySelector('.hero');

        document.documentElement.classList.add('js');

        reveal_elements.forEach(function (element, index) {
            element.classList.add('reveal');
            if (element.classList.contains('application-card') || element.classList.contains('benefit-card')) {
                element.style.setProperty('--reveal-delay', String((index % 4) * 70) + 'ms');
            }
        });

        if ('IntersectionObserver' in window) {
            var reveal_observer = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px 0px -8% 0px',
                threshold: 0.12
            });

            reveal_elements.forEach(function (element) {
                reveal_observer.observe(element);
            });
        } else {
            reveal_elements.forEach(function (element) {
                element.classList.add('is-visible');
            });
        }

        if (hero) {
            window.requestAnimationFrame(function () {
                hero.classList.add('is-loaded');
            });
        }
    }

    var path_language = get_path_language();
    var stored_language = get_stored_language();
    if (path_language === 'uz' && stored_language && stored_language !== 'uz' && window.location.pathname === '/') {
        apply_language(stored_language, 'replace');
    } else {
        store_language(path_language);
    }

    update_header_state();
    window.addEventListener('scroll', update_header_state, { passive: true });
    initialize_motion();
}());
