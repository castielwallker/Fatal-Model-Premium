# Fatal Model Premium

### Descrição
O **Fatal Model Premium** é um UserScript desenvolvido para o Tampermonkey, que facilita a navegação no site [Fatal Model](https://fatalmodel.com/) ao:
- **Remover anúncios** e banners indesejados.
- **Eliminar efeitos de blur** em perfis e imagens.
- **Desbloquear perfis censurados** automaticamente.
- **Monitorar mudanças no DOM** para aplicar as funções sempre que necessário.

---

## Funcionalidades
- **Remoção automática de anúncios e banners**.
- **Desbloqueio de perfis** com restrição.
- **Adição de botões de download** para mídias.
- **Eliminação do blur** de conteúdos restritos.
- **Aplicação automática das funções** a cada alteração no site.

---

## Pré-requisitos
- **Navegador com suporte a Tampermonkey** (Chrome, Firefox, Edge, etc.).
- **Extensão Tampermonkey** instalada.

---

## Instalação

### 1. Instalar Tampermonkey
1. Acesse o site oficial: [https://www.tampermonkey.net/](https://www.tampermonkey.net/).
2. Escolha a versão para o seu navegador e instale.
3. Após a instalação, ative a extensão no navegador.

### 2. Adicionar o Script
1. Clique no ícone do **Tampermonkey** na barra de ferramentas do navegador.
2. Selecione a opção **"Create a new script"**.
3. Substitua o conteúdo da área de edição pelo código disponível no repositório.
4. **Salve o script** clicando em **File -> Save** ou pressionando `Ctrl + S`.

---

## Como Usar

1. **Acesse o site**: [Fatal Model](https://fatalmodel.com/).

### Bloqueio de anúncios:
- Todos os **anúncios e banners** são removidos automaticamente ao carregar a página.

### Desbloqueio de perfis censurados:
- Perfis marcados como **"não permitido"** são **desbloqueados automaticamente**.

### Remoção do blur:
- Imagens e vídeos restritos não terão **efeito de blur**.

### Atualizações automáticas:
- Toda vez que o conteúdo da página muda, o **script é reativado automaticamente** para aplicar todas as funcionalidades.

---

## Personalização

### Bloqueio de novos elementos:
- Adicione classes CSS de elementos indesejados ao **array `classesToBlock`** para removê-los automaticamente.

### Estilo dos botões:
- Modifique o **CSS na função que cria os botões** para personalizar cor, posição ou tamanho.

---

## Contribuição
- Sinta-se à vontade para enviar **pull requests** ou abrir **issues** para sugestões ou correções.

---

## Licença
Este projeto é licenciado sob a **MIT License**.
