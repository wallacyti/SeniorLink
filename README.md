# SeniorLink

**Cuidado hoje, mais liberdade amanhã.**

Apresentação visual e demonstração interativa do projeto acadêmico SeniorLink, preparadas para o balcão do 6º Workshop de Educação Continuada em TI da UNICID. A página inicial é uma vitrine animada para ficar passando no notebook, com identidade branca e azul, logo oficial, celular em destaque e frases curtas. A referência principal é o [aplicativo Android da equipe](https://github.com/ProgrammerPerederko/SeniorLink).

**Site:** [wallacyti.github.io/SeniorLink](https://wallacyti.github.io/SeniorLink/)

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

1. Abra o site. A opção **App atual** apresenta dez composições web baseadas nos layouts Android: boas-vindas, cuidado, conexão, aprendizado, início, perfil, localização, lembretes, tutoriais e emergência. As telas passam automaticamente a cada **8,5 segundos**, em loop. A opção **MVP do banner** mantém as 16 telas originais do material impresso, na mesma ordem.
2. Clique em **Modo exposição** para ativar a tela cheia. Os controles somem depois de quatro segundos sem interação; mova o mouse, toque na tela ou use o teclado para mostrá-los novamente.
3. Use **Pausar**, as setas ou a faixa de telas para controlar a apresentação. Essa faixa pode ser rolada em telas menores; o nome da tela atual aparece no rodapé. Escolher uma tela ou mudar entre as duas apresentações pausa a sequência. Clique em reproduzir para continuar.
4. **Esc** ou **Sair da exposição** retorna à visualização normal. A tecla Espaço também alterna reprodução/pausa quando o foco não está em um botão ou link; as setas do teclado mudam a cena.
5. Clique em **Explorar o app** para abrir o simulador interativo. Ele continua disponível com as visões de pessoa idosa e familiar, lembretes, tutoriais e SOS simulado.

A página respeita a preferência do sistema por movimento reduzido; nesse caso, começa pausada. Ao trocar de aba, suspende a animação e conserva o ponto da apresentação. O modo exposição solicita que a tela permaneça ativa quando o navegador oferece essa possibilidade.

No simulador, **Aumentar letras** amplia o conteúdo do celular e **Reiniciar** restaura os lembretes de exemplo. O banner e o vídeo originais estão em **O projeto → Veja de onde tudo começou**. O vídeo é local e sem áudio.

## O que está implementado

- Página inicial branca, azul-marinho e azul-claro, com detalhes verde-água, celular e transições suaves.
- Dez telas baseadas nos layouts Android, com a logo e duas ilustrações originais em resolução maior.
- Alternativa com as 16 telas do banner, preservando os pixels da imagem original.
- Navegação manual, pausa, modo exposição e controles que se ocultam automaticamente.
- Página secundária responsiva com simulador e detalhes do projeto na mesma identidade visual.
- Navegação entre início, perfil, localização, lembretes, aprendizado, SOS e contatos.
- Visões demonstrativas de Maria (pessoa idosa) e Carlos (familiar).
- Criação, filtro e conclusão de lembretes, com armazenamento local no navegador quando permitido.
- Quatro tutoriais, cada um com três passos navegáveis.
- Fluxo demonstrativo de SOS com confirmação e resultado.
- Contatos e compartilhamento de localização simulados, sem chamadas externas.
- Apresentação automática, tela cheia, tamanho de texto ajustável e reinicialização.
- Menu para celular, FAQ e visualizador dos materiais do MVP.

## Limites desta versão

Este é um **protótipo para apresentação**, não um serviço operacional de cuidado. A página inicial apresenta recriações web dos layouts do código Android, sem executar o aplicativo Android. Os controles dentro do telefone são visuais. Na opção do banner, as telas são imagens cuja nitidez depende da resolução fornecida. O simulador em `explorar.html` é uma adaptação interativa, com layout próprio e mapa fixo em SVG. Não há GPS, autenticação, cadastro real, banco de dados, envio de notificações, ligações ou acionamento de emergência. A ficha de Maria e os contatos são fictícios. Os lembretes não devem ser usados para organizar medicação real.

O armazenamento local contém apenas os exemplos adicionados na demonstração. Não existe envio de dados a um servidor. O modo familiar compartilha o mesmo cenário local da pessoa idosa; não representa sincronização entre contas.

## Estrutura

```text
index.html              Apresentação visual para exposição
showcase.js             Cenas, transições, controles e reprodução
app-screens.js          Composições web baseadas no aplicativo Android
css/showcase.css        Cenário, perspectiva e composição das telas
explorar.html           Site detalhado e simulador interativo
index.js                Navegação e estado do simulador
css/index.css           Identidade visual do simulador
css/brand.css           Identidade branca e azul na página secundária
assets/                 Marca, avatar, banner, vídeo e referência Navigator
assets/app/             Logo e ilustrações originais do aplicativo
scripts/serve.mjs        Servidor local sem dependências
docs/ANALISE.md          Análise do Navigator e decisões do projeto
docs/VALIDACAO.md        Verificações realizadas
THIRD_PARTY_NOTICES.md   Procedência dos assets e licença do Navigator
.nojekyll               Suporte à publicação estática no GitHub Pages
.reference/             Referências originais e QA locais (ignorados pelo Git)
```

Os ícones ficam embutidos nas duas páginas HTML para funcionar também por duplo clique. `assets/icons.svg` mantém o catálogo-fonte correspondente. Ao modificar um ícone, mantenha as cópias sincronizadas.

## Repositório e publicação

Repositório: [wallacyti/SeniorLink](https://github.com/wallacyti/SeniorLink).

- `main`: versão estável, publicada automaticamente no GitHub Pages.
- `develop`: branch para continuar o desenvolvimento.
- `origin`: conexão HTTPS com o repositório da equipe.

A pasta `.reference` está excluída no `.gitignore`; ela guarda o Navigator original, ferramentas temporárias e capturas de validação. As duas branches partem da primeira versão funcional. As alterações em `develop` podem ser revisadas antes de serem integradas à `main`.

O GitHub Pages está configurado para publicar a raiz `/` da branch `main`, com HTTPS, em [wallacyti.github.io/SeniorLink](https://wallacyti.github.io/SeniorLink/). O site é estático e usa caminhos relativos; não exige processo de build próprio. O arquivo `.nojekyll` mantém os arquivos estáticos sem processamento de Jekyll. Novos envios à `main` iniciam uma nova publicação, que pode levar alguns minutos.

O repositório, o código, o banner e o vídeo são públicos, conforme autorizado pela equipe. A cópia offline continua funcionando de forma independente.

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

Para publicar uma versão já revisada, quando `main` não tiver alterações divergentes:

```powershell
git switch main
git pull --ff-only
git merge --ff-only develop
git push origin main
git switch develop
```

Se houver histórico divergente, revise a integração antes de publicar; não use envio forçado. Acompanhe a execução **pages build and deployment** na aba [Actions](https://github.com/wallacyti/SeniorLink/actions) do repositório.

## Verificação de sintaxe

```powershell
npm run check
```

Os fluxos de interação e layouts foram verificados em navegador Chromium/Edge, incluindo modo offline. Veja `docs/VALIDACAO.md`.

## Referências e autoria

O conteúdo foi desenvolvido a partir do roteiro, do banner e do vídeo fornecidos pela equipe SeniorLink em `Downloads\SeniorLink`. Os originais nessa pasta foram preservados.

A identidade atual e as composições do aplicativo se baseiam no repositório [ProgrammerPerederko/SeniorLink](https://github.com/ProgrammerPerederko/SeniorLink), consultado em 29/09/2026 no commit `0de362c94d625140f221c9d46f076fcaec7d8de6`. A logo e as duas ilustrações foram copiadas sem alterações. A marca de navegação usa o símbolo oficial, enquadrado em SVG.

O template **Navigator**, do conjunto [awesome-landing-pages de PaulleDemon](https://github.com/PaulleDemon/awesome-landing-pages), foi a referência inicial para a apresentação em movimento. Seu mockup permanece nos arquivos como referência histórica, com crédito e licença MIT em `THIRD_PARTY_NOTICES.md`. A versão atual usa um celular de moldura clara desenhado em CSS. Os vídeos recentes e a captura da conversa não foram incorporados aos arquivos públicos.
