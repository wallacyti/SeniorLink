# Análise e transformação: Navigator → SeniorLink

## Formato final para o balcão

A página inicial foi ajustada ao uso em exposição: uma composição de tela inteira com fundo preto, luz ambiente discreta, celular na mão e as 16 telas originais do banner em sequência automática. O mockup original do Navigator foi reaproveitado sem editar o bitmap. Cada tela do banner é enquadrada com `viewBox` em SVG e dimensionada sobre o aparelho; logo, ilustrações e conteúdo vêm diretamente da imagem fornecida. Os arquivos de imagem originais não são alterados. O crédito e a licença estão em `THIRD_PARTY_NOTICES.md`.

A revisão substitui as seis interfaces inicialmente adaptadas pelas 16 telas do material impresso, incluindo os fluxos visuais de login e cadastro. Essas telas são imagens para exposição; o simulador interativo secundário mantém sua implementação própria. A qualidade de ampliação depende da resolução do banner.

As novas referências em vídeo combinam a estética do Navigator com a alternância de telas do SeniorLink. A apresentação usa frases curtas e dispensa rolagem no notebook. O modo exposição oculta os controles após inatividade, oferece tela cheia e mantém a navegação manual disponível.

O simulador e a apresentação detalhada continuam em `explorar.html`, acessíveis pelo botão “Explorar o app”. Os vídeos recentes e a captura de conversa serviram como referências locais de direção visual e não foram incluídos na publicação.

As seções abaixo registram a análise da base e a construção do simulador preservado.

## Materiais analisados

- `Downloads/SeniorLink/navigator.zip`: estrutura, HTML, JavaScript, folhas de estilo, configuração Tailwind, package.json, readme e conjunto de assets.
- `Downloads/SeniorLink/Roteiro SeniorLink.pdf`: duas páginas, extraídas e conferidas visualmente.
- Banner do WhatsApp: 16 telas do MVP, da apresentação ao perfil, localização, lembretes, SOS, aprendizado, contatos e configurações.
- Vídeo do WhatsApp: 27,51 segundos, sem faixa de áudio; observação por quadros da área de aprendizado, início e apresentação do protótipo em um celular.

## O que é o Navigator

O template fornecido é uma landing page estática para um conceito de aplicativo automotivo. A tela principal apresenta um telefone com uma interface de carro e velocidade. Uma segunda imagem mostra controles de climatização. Não existe implementação de navegação, telemetria ou integração com veículos.

Sua composição inclui cabeçalho, hero com telefone inclinado, carrossel de marcas, benefícios com telefone fixo na rolagem, cartões de recursos, artigos, FAQ, formulário de e-mail e rodapé. Os blocos utilizam textos genéricos e vários links vazios. O JavaScript cuida de menu responsivo, animações GSAP/ScrollTrigger e abertura de FAQ.

O visual usa fundo preto, grandes títulos, iluminação difusa atrás do aparelho, cartões escuros e destaque azul. Os arquivos incluem Tailwind pré-compilado com prefixo `tw-`, uma folha CSS adicional, Google Fonts, Bootstrap Icons e GSAP por CDN.

Pontos técnicos relevantes:

- O pacote declara Tailwind 3.4.1; os scripts usam `cross-env`, mas essa dependência não está declarada.
- Os scripts apontam a entrada `tailwind.css` na raiz, embora o arquivo esteja em `css/tailwind.css`.
- Não há backend, autenticação nem testes funcionais.
- A navegação/FAQ depende de lógica com alturas e larguras fixas; há oportunidades de melhorar teclado, semântica e comportamento responsivo.
- A página original carrega bibliotecas, fontes e ícones da internet, o que não é adequado para depender deles durante uma apresentação offline.

## Tradução para o SeniorLink

### Identidade e composição

Preservamos o conceito visual de apresentar o produto por meio de um telefone em destaque, o fundo escuro inicial, o brilho sutil e a narrativa por seções. A cor principal mudou para petróleo com verde-menta, acompanhada de azul, creme e cores suaves para diferenciar funções. Os títulos e as mensagens seguem o roteiro: cuidado, autonomia, conexão e inclusão digital.

Em vez de fotografias e logotipos genéricos, a página mostra interfaces reais da demonstração, uma ilustração de Maria, uma marca vetorial simplificada e os materiais originais da equipe. Não há alegações de número de usuários, resultados comprovados, parceiros ou disponibilidade em lojas.

### De apresentação estática a demonstração

| Referência | Implementação SeniorLink |
| --- | --- |
| Imagem de telefone automotivo | Prévia do SeniorLink e simulador navegável |
| Benefícios do carro | Localização, lembretes, rede de apoio, perfil e aprendizado |
| Logos de empresas | Mensagem sobre pessoas idosas, familiares e cuidadores |
| Artigos genéricos | Explicação da proposta e materiais do MVP |
| Cadastro de e-mail | Entrada direta na demonstração, sem coleta de dados |
| FAQ do template | Dúvidas sobre público, acesso, simulações e acessibilidade |
| Links de download vazios | Botões para experimentar a demonstração |

### Fluxos do MVP

O roteiro da apresentação prioriza início, perfil, localização e emergência. O banner e o vídeo acrescentam lembretes e treinamento. Esses fluxos foram implementados como interações locais. As telas de autenticação e cadastro foram deixadas fora do caminho de apresentação para permitir acesso imediato; não há uma falsa promessa de contas funcionais.

Maria e Carlos são personagens de demonstração. O endereço deriva do cenário ilustrativo do banner e é marcado como fictício. A idade numérica do banner não foi repetida, pois poderia ficar inconsistente ao longo do tempo. O perfil não contém tratamentos ou recomendações médicas.

## Arquitetura escolhida

HTML, CSS e JavaScript sem dependências externas. A implementação do template foi reestruturada, mantendo a inspiração de composição e substituindo o conteúdo e a lógica pelo contexto do SeniorLink. Assim, pode funcionar por arquivo local ou servidor simples e também ser hospedada como conteúdo estático.

O simulador organiza telas por funções de renderização, usa delegação de eventos, valida e escapa conteúdo digitado e persiste apenas lembretes de exemplo. Falhas ou bloqueios no armazenamento não impedem a utilização durante a sessão.

O servidor de desenvolvimento publica apenas a página, o JavaScript, CSS e assets. Arquivos de referência e desenvolvimento ficam fora das rotas servidas. O vídeo local aceita requisições HTTP de intervalo para permitir reprodução e busca.

## Próximos passos possíveis

Revisar o visual com o grupo e continuar as melhorias na branch `develop`, mantendo a versão estável em `main`. Uma evolução para aplicativo operacional exigiria um projeto separado de autenticação, permissões, consentimento de localização, persistência, contatos reais e notificações. A demonstração atual não implementa nem simula uma entrega real desses serviços.
