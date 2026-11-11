// ==UserScript==
// @name         Fatal Model Premium - Maad Enhanced
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Clean ads, unblur media, unlock reviews, animated circular download buttons (gallery-safe).
// @author       Maad
// @match        https://fatalmodel.com/*
// @grant        GM_download
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @icon   https://files.fatalmodel.com/project-seo-pages/img/favicons/apple-touch-icon.webp
// ==/UserScript==

(function () {
    'use strict';

    function inGallery() {
        try { return /\/galeria(\/|$)/.test(location.pathname); } catch (e) { return false; }
    }

    const CLASSES_TO_HIDE = [
        'publicity', 'embed-publicity', 'publicity-header__content', 'alert-premium-media',
        'alert-premium-media__wrapper', 'publicity-content', 'embed-publicity__footer',
        'embed-publicity__header', 'publicity-header', 'informative-content',
        'embed-conversion-modal', 'content_blocking', 'content-blocking', 'premium-banner',
        'banner-review-gallery', 'conversion-modal', 'premium-upsell', 'upsell-banner',
        'mkt-banner', 'marketing-banner'
    ];

    const AD_TEXT_RE = /(experimente (o )?premium|libere (todas )?as vantagens do premium|fatal model premium por|conteudo exclusivo|publicidade|propaganda)/i;

    function waitForBody(cb) {
        if (document.body) { cb(); return; }
        const t = setInterval(() => { if (document.body) { clearInterval(t); cb(); } }, 50);
    }

    function safeGmDownload(url, name) {
        try {
            if (typeof GM_download === 'function') {
                GM_download({ url: url, name: name || 'media', saveAs: false });
                return true;
            }
        } catch (e) {}
        try {
            const a = document.createElement('a');
            a.href = url;
            a.download = name || '';
            a.target = '_blank';
            a.rel = 'noopener';
            document.body.appendChild(a);
            a.click();
            a.remove();
            return true;
        } catch (e) {
            return false;
        }
    }

    function fileNameFromUrl(url) {
        try {
            const u = new URL(url, location.href);
            const p = u.pathname.split('/').pop();
            return p && p.length ? decodeURIComponent(p) : 'media';
        } catch (e) {
            return 'media';
        }
    }

    function isProtected(el) {
        if (!el) return true;
        const tag = (el.tagName || '').toLowerCase();
        if (tag === 'body' || tag === 'html' || tag === 'main' || el.id === '__nuxt' || el.id === '__layout') return true;
        try { if (el.querySelectorAll('*').length > 60) return true; } catch (e) {}
        return false;
    }

    function hasMedia(el) {
        try { return !!(el && (el.matches('img,video') || el.querySelector('img,video'))); } catch (e) { return false; }
    }

    function hideNonMediaChildren(el) {
        try {
            Array.from(el.children).forEach(ch => {
                if (hasMedia(ch)) return;
                ch.style.setProperty('display', 'none', 'important');
            });
            el.style.background = 'transparent';
            el.style.border = 'none';
            el.style.boxShadow = 'none';
        } catch (e) {}
    }

    function hideElementOrKeepMedia(el) {
        if (isProtected(el)) return;
        if (hasMedia(el)) hideNonMediaChildren(el);
        else try { el.style.setProperty('display', 'none', 'important'); } catch (e) {}
    }

    function hideClassNodes() {
        CLASSES_TO_HIDE.forEach(cls => {
            document.querySelectorAll('*').forEach(el => {
                if (isProtected(el)) return;
                const cn = (el.getAttribute('class') || '');
                if (cn && (cn === cls || cn.split(/\s+/).includes(cls))) {
                    hideElementOrKeepMedia(el);
                }
            });
        });
    }

    function hideSelectors() {
        const sels = ['.publicity', '.embed-publicity', '.alert-premium-media', '.embed-conversion-modal', '.content_blocking', '.premium-upsell', '.paywall', '.mkt-banner', '.marketing-banner'];
        sels.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (isProtected(el)) return;
                hideElementOrKeepMedia(el);
            });
        });
    }

    function hideUpsellBlocks() {
        document.querySelectorAll('div, section, aside, p').forEach(el => {
            if (isProtected(el)) return;
            const t = (el.textContent || '').trim();
            if (!t || t.length < 12 || t.length > 200) return;
            if (AD_TEXT_RE.test(t) && el.children.length <= 5) {
                hideElementOrKeepMedia(el);
            }
        });
    }

    function removeBlur() {
        document.querySelectorAll('[class*="blur"]').forEach(el => {
            try {
                const cls = Array.from(el.classList).filter(c => c.toLowerCase().includes('blur'));
                el.classList.remove(...cls);
                el.style.filter = 'none';
                el.style.backdropFilter = 'none';
                el.style.webkitFilter = 'none';
                el.style.webkitBackdropFilter = 'none';
            } catch (e) {}
        });
        document.querySelectorAll('*').forEach(el => {
            const f = (el.getAttribute('style') || '');
            if (/blur\s*\(/i.test(f)) {
                el.style.filter = 'none';
                el.style.webkitFilter = 'none';
                el.style.backdropFilter = 'none';
            }
        });
        document.querySelectorAll('.grid-gallery__post--premium .grid-gallery__post-image, img, video').forEach(el => {
            try {
                el.style.filter = 'none';
                el.style.webkitFilter = 'none';
            } catch (e) {}
        });
        document.querySelectorAll('.not-allowed').forEach(el => el.classList.remove('not-allowed'));
    }

    function unblockReviews() {
        document.querySelectorAll('[class*="review"]').forEach(el => {
            try {
                el.style.maxHeight = 'none';
                el.style.overflow = 'visible';
                el.style.height = 'auto';
                el.style.filter = 'none';
            } catch (e) {}
        });
        document.querySelectorAll('[style*="max-height"], [style*="overflow: hidden"], [style*="overflow:hidden"]').forEach(el => {
            try {
                el.style.maxHeight = 'none';
                el.style.overflow = 'visible';
            } catch (e) {}
        });
    }

    const DL_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v9.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1zm-7 17a1 1 0 0 1 0-2h14a1 1 0 1 1 0 2H5z"/></svg>';

    function injectDownloadButton(media) {
        if (inGallery()) return;
        if (!media || (media.dataset && media.dataset.fmDl)) return;
        const src = (media.currentSrc || media.src || (media.querySelector && media.querySelector('source') && media.querySelector('source').src) || '').trim();
        if (!src || src.startsWith('data:')) return;
        if (media.dataset) media.dataset.fmDl = '1';

        const parent = media.parentElement;
        if (!parent) return;
        if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'fm-dl-btn';
        btn.innerHTML = DL_SVG;
        btn.title = 'Download';
        btn.setAttribute('data-fm-dl-btn', '1');
        Object.assign(btn.style, {
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            zIndex: '999999',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,.28)',
            background: 'rgba(37,99,235,.82)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 2px 12px rgba(0,0,0,.4)',
            transition: 'transform .18s ease, box-shadow .18s ease, opacity .18s ease',
            opacity: '.95'
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.12)';
            btn.style.animation = 'fmDlColor 1.1s linear infinite';
            btn.style.opacity = '1';
            btn.style.boxShadow = '0 4px 16px rgba(0,0,0,.55)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
            btn.style.animation = 'none';
            btn.style.background = 'rgba(37,99,235,.82)';
            btn.style.opacity = '.95';
            btn.style.boxShadow = '0 2px 12px rgba(0,0,0,.4)';
        });
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            safeGmDownload(src, fileNameFromUrl(src));
        }, true);
        parent.appendChild(btn);
    }

    function scanMedia() {
        if (inGallery()) return;
        document.querySelectorAll('img').forEach(img => {
            const s = (img.currentSrc || img.src || '').trim();
            if (s && (s.includes('fatalmodel.com') || s.includes('files.fatalmodel'))) {
                injectDownloadButton(img);
            }
        });
        document.querySelectorAll('video').forEach(v => {
            const s = (v.currentSrc || v.src || (v.querySelector('source') && v.querySelector('source').src) || '').trim();
            if (s) injectDownloadButton(v);
        });
    }

    function injectPanel() {
        if (!document.body || document.getElementById('fm-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'fm-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            bottom: '16px',
            left: '16px',
            zIndex: '9999999',
            display: 'flex',
            gap: '8px',
            padding: '8px',
            background: 'rgba(12,12,12,.78)',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 18px rgba(0,0,0,.35)'
        });
        const mkBtn = (label, onclick) => {
            const b = document.createElement('button');
            b.textContent = label;
            Object.assign(b.style, {
                border: '1px solid rgba(255,255,255,.15)',
                borderRadius: '9px', padding: '7px 12px',
                background: 'rgba(255,255,255,.08)', color: '#fff',
                cursor: 'pointer', fontSize: '12px', fontWeight: '500',
                transition: 'background .15s ease, transform .15s ease'
            });
            b.addEventListener('mouseenter', () => { b.style.background = 'rgba(255,255,255,.18)'; b.style.transform = 'translateY(-1px)'; });
            b.addEventListener('mouseleave', () => { b.style.background = 'rgba(255,255,255,.08)'; b.style.transform = 'translateY(0)'; });
            b.addEventListener('click', onclick);
            return b;
        };
        panel.appendChild(mkBtn('baixar midias', () => {
            document.querySelectorAll('img,video').forEach(m => {
                const s = (m.currentSrc || m.src || (m.querySelector && m.querySelector('source') && m.querySelector('source').src) || '').trim();
                if (s) safeGmDownload(s, fileNameFromUrl(s));
            });
        }));
        panel.appendChild(mkBtn('limpar', runAll));
        panel.appendChild(mkBtn('x', () => panel.remove()));
        document.body.appendChild(panel);
    }

    function runAll() {
        if (inGallery()) return; // CSS-only in gallery; no DOM mutation
        hideClassNodes();
        hideSelectors();
        hideUpsellBlocks();
        removeBlur();
        unblockReviews();
        scanMedia();
        injectPanel();
    }

    try {
        const css = [
            '[class*="blur"], [class*="Blur"], .blured, .blur, .backdrop-blur { filter: none !important; backdrop-filter: none !important; -webkit-filter: none !important; }',
            '.grid-gallery__post--premium .grid-gallery__post-image, img, video { filter: none !important; -webkit-filter: none !important; }',
            '.publicity, .embed-publicity, .alert-premium-media, .embed-conversion-modal, .content_blocking, .premium-upsell { display: none !important; }',
            '@keyframes fmDlColor { 0% { background: rgba(59,130,246,.9); } 25% { background: rgba(16,185,129,.9); } 50% { background: rgba(236,72,153,.9); } 75% { background: rgba(245,158,11,.9); } 100% { background: rgba(59,130,246,.9); } }',
            '.fm-dl-btn:hover { animation: fmDlColor 1.2s linear infinite !important; }'
        ].join('\n');
        if (typeof GM_addStyle === 'function') GM_addStyle(css);
        else {
            const st = document.createElement('style');
            st.textContent = css;
            (document.head || document.documentElement).appendChild(st);
        }
    } catch (e) {}

    waitForBody(() => {
        if (inGallery()) return; // do not touch gallery DOM
        runAll();
        const obs = new MutationObserver(() => {
            hideClassNodes();
            hideSelectors();
            removeBlur();
            unblockReviews();
            scanMedia();
        });
        try { obs.observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    });

    setInterval(() => { if (inGallery()) return; waitForBody(runAll); }, 2500);

    ['pushState', 'replaceState'].forEach(fn => {
        const orig = history[fn];
        history[fn] = function () {
            const r = orig.apply(this, arguments);
            setTimeout(runAll, 600);
            return r;
        };
    });
    window.addEventListener('popstate', () => setTimeout(runAll, 600));

})();
