# SeniorLink

**Cuidado hoje, mais liberdade amanhã.**

Site de apresentação e demonstração interativa do projeto acadêmico SeniorLink, preparado para o balcão do 6º Workshop de Educação Continuada em TI da UNICID.

## Abrir agora

A maneira mais simples é abrir `index.html` no navegador com um duplo clique. Todos os recursos visuais e de interação são locais; o site não depende de internet.

Para desenvolver com um servidor local, instale o Node.js 18 ou superior e, dentro desta pasta, execute:

```powershell
npm start
```

Abra **http://localhost:4173**. Não é necessário executar `npm install`: este projeto não tem dependências de execução ou compilação. O servidor escuta somente neste computador. Use Ctrl+C no terminal para encerrá-lo.

Se a porta estiver ocupada:

```powershell
$env:PORT = '4174'
npm start
```

O armazenamento de lembretes depende do navegador. `file://`, `http://localhost:4173` e uma futura URL pública mantêm dados separados.

## Apresentar no balcão

1. Abra o site e clique em **Experimentar o app**.
2. Use as opções **Sou pessoa idosa** e **Sou familiar** para mostrar as duas perspectivas.
3. Clique em **Apresentação automática** para alternar as seis telas principais a cada 8 segundos.
4. Use o ícone de tela cheia ao lado do botão para destacar a demonstração. Saia pelo mesmo botão ou pela tecla Esc.
5. Ao interagir, a apresentação automática pausa. Ela também pausa quando a aba fica em segundo plano.
6. **Aumentar letras** amplia o texto do aplicativo. O conteúdo do celular pode ser rolado quando necessário.
7. Antes da próxima apresentação, use **Reiniciar** e confirme para restaurar os três lembretes iniciais.

O banner e o vídeo originais estão em **O projeto → Veja de onde tudo começou**. O vídeo é local e sem áudio.

## O que está implementado

- Página responsiva de apresentação do projeto.
- Navegação entre início, perfil, localização, lembretes, aprendizado, SOS e contatos.
- Visões demonstrativas de Maria (pessoa idosa) e Carlos (familiar).
- Criação, filtro e conclusão de lembretes, com armazenamento local no navegador quando permitido.
- Quatro tutoriais, cada um com três passos navegáveis.
- Fluxo demonstrativo de SOS com confirmação e resultado.
- Contatos e compartilhamento de localização simulados, sem chamadas externas.
- Apresentação automática, tela cheia, tamanho de texto ajustável e reinicialização.
- Menu para celular, FAQ e visualizador dos materiais do MVP.

## Limites desta versão

Este é um **protótipo para apresentação**, não um serviço operacional de cuidado. O mapa é um cenário fixo desenhado em SVG. Não há GPS, autenticação, cadastro real, banco de dados, envio de notificações, ligações ou acionamento de emergência. A ficha de Maria e os contatos são fictícios. Os lembretes não devem ser usados para organizar medicação real.

O armazenamento local contém apenas os exemplos adicionados na demonstração. Não existe envio de dados a um servidor. O modo familiar compartilha o mesmo cenário local da pessoa idosa; não representa sincronização entre contas.

## Estrutura

```text
index.html              Página e ícones SVG embutidos
index.js                Navegação e estado da demonstração
css/index.css           Identidade visual e responsividade
assets/                 Marca vetorial, avatar, banner e vídeo
scripts/serve.mjs        Servidor local sem dependências
docs/ANALISE.md          Análise do Navigator e decisões do projeto
docs/VALIDACAO.md        Verificações realizadas
.nojekyll               Suporte à publicação estática no GitHub Pages
.reference/             Referências originais e QA locais (ignorados pelo Git)
```

Os ícones ficam embutidos em `index.html` para funcionar também por duplo clique. `assets/icons.svg` mantém o catálogo-fonte correspondente. Ao modificar um ícone, mantenha os dois sincronizados.

## Repositório e publicação

Repositório: [wallacyti/SeniorLink](https://github.com/wallacyti/SeniorLink).

- `main`: versão estável do site.
- `develop`: branch para continuar o desenvolvimento.
- `origin`: conexão HTTPS com o repositório da equipe.

A pasta `.reference` está excluída no `.gitignore`; ela guarda o Navigator original, ferramentas temporárias e capturas de validação. As duas branches partem da primeira versão funcional. As alterações em `develop` podem ser revisadas antes de serem integradas à `main`.

O site é estático e usa caminhos relativos, portanto pode ser servido por GitHub Pages, inclusive em um caminho de projeto como `/SeniorLink/`. Não exige processo de build. Para uma futura publicação, use a raiz que contém `index.html`. O banner e o vídeo em `assets` fazem parte do site e serão públicos se o site for publicado.

Para continuar o desenvolvimento:

```powershell
git switch develop
git pull --ff-only
npm start
```

Depois de editar e conferir o site:

```powershell
npm run check
git add .
git commit -m "Descreva a alteração realizada"
git push
```

O `push` da branch `develop` envia o código para revisão. Ele não integra automaticamente as alterações à `main`.

## Verificação de sintaxe

```powershell
npm run check
```

Os fluxos de interação e layouts foram verificados em navegador Chromium/Edge, incluindo modo offline. Veja `docs/VALIDACAO.md`.

## Referências e autoria

O conteúdo foi desenvolvido a partir do roteiro, do banner e do vídeo fornecidos pela equipe SeniorLink em `Downloads\SeniorLink`. Os originais nessa pasta foram preservados.

A referência de composição foi o template **Navigator**, do conjunto [awesome-landing-pages de PaulleDemon](https://github.com/PaulleDemon/awesome-landing-pages), cujo pacote fornecido declara licença MIT. A implementação desta versão foi reescrita com HTML, CSS e JavaScript locais. Os assets automotivos, logotipos de terceiros e textos genéricos do Navigator não foram usados no site final. A marca vetorial simplificada e o avatar desta versão foram desenhados em SVG; o banner mantém a identidade visual original enviada pela equipe.
