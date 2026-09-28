# Validação da demonstração

Verificações executadas em 28/09/2026, em Microsoft Edge/Chromium no Windows.

- Sintaxe de `index.js` e do servidor local com `npm run check`.
- Renderização da página em larguras de 320, 390, 768, 1024 e 1440 pixels, sem rolagem horizontal.
- Revisão visual da página inicial, seções e simulador em desktop e celular.
- Navegação entre as seis telas principais e telas secundárias.
- Criação, conclusão e filtro de lembretes.
- Persistência de lembretes após recarregar a página.
- Três passos de tutorial e retorno à lista.
- Fluxo de SOS com confirmação e resultado sem acionamento real.
- Simulação de contato e de compartilhamento sem chamadas externas.
- Troca de perspectiva para o familiar.
- Ampliação do texto e rolagem interna do aplicativo.
- Reinicialização dos dados da demonstração.
- Apresentação automática após oito segundos e pausa por interação.
- Entrada e saída de tela cheia no desktop.
- Abertura dos materiais originais e leitura dos metadados do vídeo local.
- Fechamento do diálogo com Esc, FAQ e menu de celular.
- Nenhum erro JavaScript, requisição externa ou falha de asset durante o percurso testado.
- Abertura por `file://` com o contexto do navegador em modo offline e navegação funcional.

A opção de movimento reduzido é respeitada. A versão inclui rótulos, foco visível, elementos semânticos e navegação por teclado, mas estas verificações não representam uma auditoria formal de conformidade de acessibilidade nem testes em todos os navegadores/dispositivos.

O script e as capturas de QA locais estão em `.reference/`, pasta excluída do Git. O projeto não depende dessas ferramentas para funcionar.

## Apresentação visual para exposição

Verificações da revisão visual em 28/09/2026:

- Seis cenas, avanço e retorno manual, setas do teclado e pausa.
- Avanço automático após 8,5 segundos e retorno da sexta cena à primeira.
- Preferência por movimento reduzido inicia a apresentação pausada.
- Composição das seis telas dentro da área do mockup, sem conteúdo cortado.
- Layout em 1440×900, 1366×768, 1024×768, 768×1024, 390×844 e 320×740.
- Encaixe em uma tela nos formatos de notebook, sem rolagem vertical.
- Visibilidade dos controles e cabeçalho em telas estreitas.
- Entrada/saída de tela cheia, ocultação após inatividade e restauração ao mover o mouse.
- Controles ocultos ficam inativos para navegação por teclado até serem restaurados.
- Acesso ao simulador em `explorar.html`, criação de lembrete e manutenção dos links antigos para seções.
- Abertura das duas páginas por arquivo local com o navegador offline.
- Nenhum erro JavaScript ou requisição a serviços externos durante os fluxos testados.
