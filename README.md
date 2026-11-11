<div align="center">

# 🎭 Fatal Model Premium

**UserScript para Tampermonkey que limpa anúncios, remove blur, desbloqueia reviews e adiciona botões de download de mídia no Fatal Model.**

![versão](https://img.shields.io/badge/vers%C3%A3o-2.6-blue)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-required-green)
![licença](https://img.shields.io/badge/licen%C3%A7a-MIT-yellow)
![status](https://img.shields.io/badge/status-ativo-brightgreen)

</div>

---

## 📖 Sobre

**Fatal Model Premium** é um UserScript que roda no **Tampermonkey** e melhora a experiência de navegação no site `fatalmodel.com`, removendo elementos de upsell/premium, eliminando efeitos de blur em mídias e reviews, e adicionando botões circulares de download nas imagens e vídeos.

O script é **não invasivo**: usa CSS injection + `MutationObserver` para reagir a mudanças no DOM, e **ignora a página de galeria** (`/galeria`) para evitar quebrar a navegação.

> ⚠️ **Aviso:** este projeto é para fins educacionais e de uso pessoal. Respeite os Termos de Serviço do site e direitos autorais do conteúdo. O autor não se responsabiliza pelo uso indevido.

---

## ✨ Funcionalidades

| Recurso | Descrição |
|---|---|
| 🚫 **Bloqueio de anúncios** | Remove banners, `publicity`, `upsell`, `conversion-modal` e blocos de texto promocional do Premium |
| 🖼️ **Remoção de blur** | Elimina `filter: blur()` de imagens, vídeos e classes `[class*="blur"]` |
| 🔓 **Reviews desbloqueadas** | Remove `max-height`, `overflow: hidden` e filtros de containers de review |
| ⬇️ **Botões de download** | Adiciona botão circular animado em cada `img`/`video` (fora da galeria) |
| 🔄 **Reaplicação automática** | `MutationObserver` + interval de 2,5s mantêm o site limpo em SPAs |
| 🧭 **Navegação SPA-aware** | Reaplica em `pushState`, `replaceState` e `popstate` |
| 🎨 **Painel flutuante** | Botões "baixar mídias", "limpar" e "x" no canto inferior esquerdo |
| 🛡️ **Modo galeria seguro** | Na rota `/galeria` o script não mexe no DOM (só CSS) |

---

## 🚀 Instalação

### Opção 1 — Instalação direta (recomendada)

1. Instale o [Tampermonkey](https://www.tampermonkey.net/) no seu navegador.
2. Abra o arquivo [`fatal.js`](./fatal.js) neste repositório.
3. Clique em **Raw** e o Tampermonkey oferecerá a instalação automaticamente.
4. Confirme em **Instalar**.

### Opção 2 — Manual

1. Instale o Tampermonkey.
2. Clique no ícone da extensão → **Create a new script**.
3. Apague o conteúdo padrão e cole todo o código de [`fatal.js`](./fatal.js).
4. Salve com `Ctrl + S`.
5. Acesse [fatalmodel.com](https://fatalmodel.com/) — o script roda automaticamente.

---

## 🎮 Como usar

Depois de instalar, basta navegar normalmente:

- **Anúncios/banners** somem sozinhos ao carregar a página.
- **Mídias** ganham um botão azul circular (canto inferior direito) para download.
- **Reviews** e **conteúdo premium** ficam visíveis sem blur.
- O **painel flutuante** (canto inferior esquerdo) permite:
  - `baixar mídias` → baixa todas as imagens/vídeos da página
  - `limpar` → reaplica todas as limpezas manualmente
  - `x` → fecha o painel

> ℹ️ Na página `/galeria` os botões de download **não** são injetados (proteção intencional).

---

## ⚙️ Como funciona (resumo técnico)

- **Injeção de CSS** (`GM_addStyle`) para blur, anúncios e animação dos botões.
- **Arrays de configuração**:
  - `CLASSES_TO_HIDE` — classes CSS de anúncios/upsell a remover
  - `AD_TEXT_RE` — regex para detectar blocos de texto promocional
- **`hideElementOrKeepMedia(el)`** — se o elemento contém mídia, esconde só os filhos não-mídia; senão, esconde o elemento inteiro.
- **`inGallery()`** — guard que bloqueia mutação de DOM na rota de galeria.
- **`MutationObserver` + setInterval(2500)** — mantém o site limpo após navegação SPA.
- **`safeGmDownload()`** — usa `GM_download` quando disponível, com fallback para `<a download>`.

---

## 🎨 Personalização

### Adicionar novas classes para bloquear

Edite o array `CLASSES_TO_HIDE` no topo do script:

```js
const CLASSES_TO_HIDE = [
    'publicity', 'embed-publicity', 'alert-premium-media',
    // adicione a sua classe aqui:
    'minha-classe-nova'
];
