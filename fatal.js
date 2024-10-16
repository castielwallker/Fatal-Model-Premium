// ==UserScript==
// @name         Fatal Model Premium
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adiciona botões de download para todas as mídias e remove anúncios
// @author       Maad
// @match        https://fatalmodel.com/*
// @grant        none
// @icon   https://files.fatalmodel.com/project-seo-pages/img/favicons/apple-touch-icon.webp

// ==/UserScript==

(function () {
    'use strict';

    let showButtons = false; // Controla se os botões estão visíveis ou não

    const classesToBlock = [
        'publicity', 'embed-publicity', 'publicity-header__content',
        'publicity-content', 'embed-publicity__footer', 'embed-publicity__header',
        'publicity-header', 'no-comparison-media__wrapper', 'description description--institutional',
        'publicity-header__close', 'w-full bg-neutral-white p-5 shadow-[0px_0px_24px_0px_#2632383D] md:text-center',
        'informative-content', 'section-block section-block--small',
        'flex justify-center items-center p-5 mt-6 bg-neutral-white relative cursor-pointer',
        'football_slider bg-white p-5 pb-2 h-full rounded-b-lg overflow-visible relative listeningGaClickEvent seen-banner'
    ];

    // Função para remover elementos indesejados
    function removeElements() {
        classesToBlock.forEach(className => {
            const elements = document.getElementsByClassName(className);
            while (elements.length > 0) {
                elements[0].remove();
            }
        });
    }

    // Função para remover efeito de blur
    function removeBlur() {
        const blurElements = document.querySelectorAll('[class*="blur"]');
        blurElements.forEach(element => {
            element.classList.remove(...Array.from(element.classList).filter(cls => cls.includes('blur')));
        });
    }

    // Função para desbloquear perfis censurados
    function skipAd() {
        const censoredProfiles = document.querySelectorAll('.item-card-v2.not-allowed');
        censoredProfiles.forEach(profile => profile.classList.remove('not-allowed'));
    }


    // Observa mudanças no DOM para aplicar alterações automaticamente
    const observer = new MutationObserver(() => {
        removeElements();
        removeBlur();
        skipAd();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
